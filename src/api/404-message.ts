import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define message variants
const VARIANTS = {
  playful: [
    "Can't find `{path}`. Our squirrels looked and came up empty-pawed.",
    "404: `{path}` went on vacation without telling anyone.",
    "You found a blank spot: `{path}`. Nice detective work.",
    "Well this is awkward — `{path}` seems to be hiding from the internet.",
    "Huh. `{path}` is playing hide-and-seek. We lost.",
    "We searched under the couch; `{path}` wasn't there.",
    "Oof. `{path}` bounced. We're on it.",
    "Error 404 — `{path}` unplugged itself for unknown reasons.",
    "Whoops. `{path}` took a detour.",
    "Looks like `{path}` never RSVP'd to the internet party.",
    "This page (`{path}`) is practicing social distancing from our server.",
    "Our map doesn't show `{path}`. Can you be our cartographer?",
    "We couldn't fetch `{path}`. Maybe it left with the cookies.",
    "Hmm. `{path}` must be under construction. Hardhat time.",
    "404 report: `{path}` — missing but suspected adorable.",
    "It's not you, it's `{path}`. It's missing.",
    "We checked the attic; `{path}` isn't there (and there were cobwebs).",
    "This feels like the plot twist: `{path}` is fictional.",
    "Your persistence found `{path}` — sadly it's invisible.",
    "404: `{path}` — currently experiencing identity issues.",
    "We tried to fetch `{path}` but it ghosted us.",
    "Well spotted. `{path}` is absent without leave.",
    "Looks like `{path}` took the scenic route and never returned.",
    "You're right to call this out — `{path}` is officially MIA."
  ],
  apologetic: [
    "We couldn't find `{path}` — sorry about that. Can you tell us what you were trying to do?",
    "`{path}` isn't available. We'll fix this if you give us a hint."
  ],
  investigative: [
    "`{path}` has been requested {count} times. Thanks for flagging — we'll investigate.",
    "This page (`{path}`) looks popular but missing — creating a ticket now."
  ],
  feature_request: [
    "That sounds like a feature we should add — `{path}`. We'll look into it.",
    "Nice idea — `{path}` would be useful. Adding it to our wishlist."
  ],
  suggest_fix: [
    "Did you mean `{closest}`? We couldn't find `{path}`.",
    "Try `{closest}` instead of `{path}` — that might work."
  ]
};

// Levenshtein distance function for typo detection
function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i-1][j] + 1,
        dp[i][j-1] + 1,
        dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

export async function post({ request }: { request: Request }) {
  try {
    const { path, search, referrer, userAgent } = await request.json();

    // 1. Upsert the 404 hit into the database
    const now = new Date().toISOString();
    const { data: existing, error: selectError } = await supabase
      .from('page_404s')
      .select('id, count, referrers, user_agents')
      .eq('path', path)
      .maybeSingle();

    if (selectError) throw selectError;

    let count = 1;
    if (existing) {
      count = (existing.count || 0) + 1;
      const referrers = Array.from(new Set([...(existing.referrers || []), referrer]));
      const user_agents = Array.from(new Set([...(existing.user_agents || []), userAgent]));

      const { error: updateError } = await supabase
        .from('page_404s')
        .update({
          count,
          last_seen: now,
          referrers,
          user_agents,
          query_params: search || null,
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from('page_404s')
        .insert({
          path,
          first_seen: now,
          last_seen: now,
          count: 1,
          referrers: referrer ? [referrer] : [],
          user_agents: userAgent ? [userAgent] : [],
          query_params: search || null,
        });

      if (insertError) throw insertError;
    }

    // 2. Get a list of known routes (you should replace this with your app's routes)
    const knownRoutes = ['/', '/search', '/contact-us', '/blog', '/products'];

    // 3. Compute signals
    const hasQuery = !!search;
    const isFrequent = count > 10;
    const externalReferrer = referrer && !referrer.includes(request.headers.get('host') || 'yourdomain.com');
    let looksLikeTypo = false;
    let closest = '';

    // Find the closest known route
    let minDistance = Infinity;
    for (const route of knownRoutes) {
      const distance = levenshtein(path, route);
      if (distance < minDistance) {
        minDistance = distance;
        closest = route;
      }
    }

    // If the edit distance is small enough, consider it a typo
    if (minDistance <= Math.max(2, Math.floor(path.length * 0.2))) {
      looksLikeTypo = true;
    }

    // 4. Determine the message bucket
    let bucket: keyof typeof VARIANTS = 'playful';
    if (looksLikeTypo) {
      bucket = 'suggest_fix';
    } else if (isFrequent) {
      bucket = 'investigative';
    } else if (hasQuery) {
      bucket = 'apologetic';
    } else if (path.includes('feature') || path.includes('suggest')) {
      bucket = 'feature_request';
    } else if (externalReferrer) {
      bucket = 'playful';
    }

    // 5. Select a random variant from the bucket and replace placeholders
    const variants = VARIANTS[bucket];
    const rawMessage = variants[Math.floor(Math.random() * variants.length)];
    const message = rawMessage
      .replace(/{path}/g, path)
      .replace(/{count}/g, String(count))
      .replace(/{closest}/g, closest);

    return new Response(JSON.stringify({ message, bucket, count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in 404-message API:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
