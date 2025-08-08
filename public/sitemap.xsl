<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" indent="yes"/>
  
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Saem's Tunes Sitemap</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          :root {
            /* Light Theme Defaults */
            --bg: hsl(36 33% 97%);
            --text: hsl(20 14% 21%);
            --card: hsl(0 0% 100%);
            --card-text: hsl(20 14% 21%);
            --primary: hsl(43 100% 33%);
            --primary-text: hsl(0 0% 100%);
            --border: hsl(20 5% 85%);
            --header: #3B2F2F;
            --row-accent: hsl(43 30% 90%);
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg: hsl(20 14% 10%);
              --text: hsl(0 0% 95%);
              --card: hsl(20 14% 15%);
              --card-text: hsl(0 0% 95%);
              --primary: hsl(43 100% 33%);
              --primary-text: hsl(0 0% 100%);
              --border: hsl(20 14% 25%);
              --header: #D4A936;
              --row-accent: hsl(20 14% 20%);
            }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            transition: background 0.3s ease;
          }

          body {
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            padding: 2rem 1rem;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
          }

          header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid var(--primary);
          }

          h1 {
            color: var(--header);
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
          }

          .subtitle {
            color: var(--primary);
            font-size: 1.1rem;
          }

          .stats {
            background: var(--card);
            color: var(--card-text);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: var(--card);
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
          }

          th {
            background: var(--primary);
            color: var(--primary-text);
            text-align: left;
            padding: 1rem;
            font-weight: 600;
          }

          tr:nth-child(even) {
            background: var(--row-accent);
          }

          td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
          }

          .url a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
          }

          .url a:hover {
            text-decoration: underline;
          }

          .priority.high { color: #7A5A00; }
          .priority.medium { color: #D4A936; }
          .priority.low { color: #5A4A4A; }

          footer {
            text-align: center;
            margin-top: 2rem;
            color: var(--primary);
            font-size: 0.9rem;
          }

          .footer-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease, text-decoration-color 0.3s ease;
          }
          
          .footer-link:hover {
          color: hsl(43 100% 25%); /* Darker gold */
          text-decoration: underline;
          text-decoration-color: hsl(43 100% 25%);
          }

        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Saem's Tunes Sitemap</h1>
            <p class="subtitle">Complete list of website resources</p>
          </header>
          
          <div class="stats">
            Total URLs: <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> | 
            Last Updated: <strong><xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/></strong>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Last Modified</th>
                <th>Priority</th>
                <th>Change Frequency</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td class="url">
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                  <td>
                    <span class="priority">
                      <xsl:attribute name="class">
                        priority 
                        <xsl:choose>
                          <xsl:when test="sitemap:priority >= 0.8">high</xsl:when>
                          <xsl:when test="sitemap:priority >= 0.5">medium</xsl:when>
                          <xsl:otherwise>low</xsl:otherwise>
                        </xsl:choose>
                      </xsl:attribute>
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          
          <footer>
            Generated by <a href="https://www.saemstunes.com/" class="footer-link">
              Saem's Tunes
            </a> • Automatically updates with content changes
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
