import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/'],
    },
    sitemap: 'https://loquacious-starlight-a7767b.netlify.app/sitemap.xml',
  };
}
