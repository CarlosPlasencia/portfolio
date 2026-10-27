import { BLOG_ARTICLE } from './blog';
import { PROFILE_IDENTITY } from './i18n';
import { getPageData, SITE_ORIGIN, type SitePage } from './seo';

export function getBlogArticlePage(): SitePage {
  const blog = getPageData('blog', 'es');
  const canonical = SITE_ORIGIN + BLOG_ARTICLE.path;
  const title = `${BLOG_ARTICLE.title} | ${PROFILE_IDENTITY.name} · ${PROFILE_IDENTITY.alias}`;
  const person = { '@id': `${SITE_ORIGIN}/#person` };
  const webpage = { '@id': `${canonical}#webpage` };
  const identity = (blog.structuredData['@graph'] as Record<string, unknown>[])
    .filter(item => item['@type'] === 'Person' || item['@type'] === 'WebSite');

  return {
    ...blog, path: BLOG_ARTICLE.path, canonical, title, description: BLOG_ARTICLE.description,
    alternates: { es: canonical, default: canonical },
    structuredData: { '@context': 'https://schema.org', '@graph': [
      ...identity,
      { '@type': 'WebPage', ...webpage, url: canonical, name: title,
        description: BLOG_ARTICLE.description, inLanguage: 'es',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` }, about: person },
      { '@type': 'BlogPosting', '@id': `${canonical}#article`, headline: BLOG_ARTICLE.title,
        description: BLOG_ARTICLE.description, url: canonical, inLanguage: 'es',
        author: person, mainEntityOfPage: webpage,
        image: `${SITE_ORIGIN}/images/carlos-plasencia.png` },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'portfolio', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: blog.canonical },
        { '@type': 'ListItem', position: 3, name: BLOG_ARTICLE.title, item: canonical },
      ] },
    ] },
  };
}
