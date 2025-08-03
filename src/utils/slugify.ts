// utils/slugify.ts
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens from both ends
};

export const createUniqueSlug = async (
  name: string,
  existingSlugs: string[] = []
): Promise<string> => {
  let baseSlug = slugify(name);
  let candidateSlug = baseSlug;
  let counter = 1;

  // Check against provided existing slugs
  while (existingSlugs.includes(candidateSlug)) {
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return candidateSlug;
};

// Optional: Supabase helper to generate unique slug
export const generateUniqueArtistSlug = async (
  name: string,
  supabase: any
): Promise<string> => {
  const baseSlug = slugify(name);
  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from('artists')
      .select('slug')
      .eq('slug', candidateSlug);

    if (error || !data || data.length === 0) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }
};
