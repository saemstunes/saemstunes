
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video' | 'music';
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Saem's Tunes - Making Music, Representing Christ",
  description = "Tots to teens to adults: everyone's go-to music learning space! Learn music theory, master instruments, and join our community.",
  keywords = "music learning, piano lessons, vocal training, guitar tutorials, music theory, online music education, music community",
  image = "https://i.imgur.com/ltEen5M.png",
  url = "https://saemstunes.app",
  type = "website",
  noIndex = false,
  noFollow = false,
  structuredData
}) => {
  const fullTitle = title.includes("Saem's Tunes") ? title : `${title} | Saem's Tunes`;
  const robotsContent = `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Saem's Tunes" />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Saem's Tunes" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@saemstunes" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags for Music Apps */}
      <meta property="music:duration" content="varies" />
      <meta property="music:album" content="Saem's Tunes Courses" />
      <meta property="music:musician" content="Saem's Tunes Instructors" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Security Headers (will be overridden by server config but good for fallback) */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
    </Helmet>
  );
};

export default SEOHead;
