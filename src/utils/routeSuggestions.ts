// utils/routeSuggestions.ts
export const knownRoutes = [
  '/', 
  '/admin',
  '/login',
  '/signup',
  '/auth',
  '/verification-waiting',
  '/terms',
  '/privacy',
  '/unauthorized',
  '/auth/callback',
  '/videos',
  '/videos/:id',
  '/resources',
  '/resources/:id',
  '/search',
  '/discover',
  '/library',
  '/community',
  '/tracks',
  '/music-showcase',
  '/player',
  '/learning-hub',
  '/learning-hub/:id',
  '/learning-module/:id',
  '/artist/:slug',
  '/notifications',
  '/follow-us',
  '/contact-us',
  '/support-us',
  '/settings',
  '/profile',
  '/services',
  '/payment',
  '/payment-success',
  '/subscriptions',
  '/music-tools',
  '/artists',
  '/learning-hub/:moduleId',
  '/bookings',
  '/book/:id',
  '/book-tutor',
  '/user-details',
  '/coming-soon',
  '/tracks/:slug',
  '/audio-player/:id',
  '*'
];

// Levenshtein distance function
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

// Smart check function
export function checkRoute(pathname: string): string | null {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const route of knownRoutes) {
    // Remove parameters for better comparison
    const cleanRoute = route.replace(/:[^/]+/g, '');
    const cleanPathname = pathname.replace(/\/$/, ''); // Remove trailing slash
    
    const distance = levenshtein(cleanPathname, cleanRoute);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = route;
    }
  }

  // Only suggest if distance is very small & path isn't already exact
  if (bestMatch && bestMatch !== pathname && bestDistance <= 2) {
    return `Sounds like you were looking for ${bestMatch} & not ${pathname}. No? Wanna give it one more shot?`;
  }

  return null;
}
