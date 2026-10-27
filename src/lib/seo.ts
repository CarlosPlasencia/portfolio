import { CONTACT_CHANNELS, PROFILE_IDENTITY, getSiteContent, type Language } from './i18n';
import { getWorkspaceEntries, PRIMARY_SKILLS, ADDITIONAL_SKILLS } from './workspace-content';
import { BLOG_ARTICLE } from './blog';

export const SITE_ORIGIN = 'https://www.carlosplasencia.dev';
const ROUTES = {
  overview: { es: '', en: 'en' },
  about: { es: 'sobre-mi', en: 'en/about' },
  financialia: { es: 'proyectos/financialia', en: 'en/projects/financialia' },
  dgf: { es: 'proyectos/dgf-inmobiliaria', en: 'en/projects/dgf-inmobiliaria' },
  maki: { es: 'proyectos/maki-panda', en: 'en/projects/maki-panda' },
  skillramp: { es: 'proyectos/skillramp', en: 'en/projects/skillramp' },
  reservaya: { es: 'proyectos/reservaya', en: 'en/projects/reservaya' },
  skills: { es: 'tecnologias', en: 'en/skills' },
  'skill-typescript': { es: 'tecnologias/typescript', en: 'en/skills/typescript' },
  'skill-frontend': { es: 'tecnologias/react-nextjs', en: 'en/skills/react-nextjs' },
  'skill-backend': { es: 'tecnologias/nestjs-graphql', en: 'en/skills/nestjs-graphql' },
  'skill-ai': { es: 'tecnologias/ia-aplicada', en: 'en/skills/applied-ai' },
  'skills-more': { es: 'tecnologias/mas', en: 'en/skills/more' },
  services: { es: 'servicios', en: 'en/services' },
  blog: { es: 'blog', en: 'en/blog' },
  contact: { es: 'contacto', en: 'en/contact' },
} as const;
type EntryId = keyof typeof ROUTES;
export interface Faq { question: string; answer: string; }
export interface PageAlternates { es: string; en?: string; default: string; }
export interface SitePage {
  entryId: string;
  language: Language;
  path: string;
  canonical: string;
  title: string;
  description: string;
  alternates: PageAlternates;
  structuredData: Record<string, unknown>;
}

export function getWorkspacePath(id: string, language: Language): string {
  if (!Object.hasOwn(ROUTES, id)) throw new RangeError(`Unknown workspace entry: ${id}`);
  const slug = ROUTES[id as EntryId][language];
  return slug ? `/${slug}/` : '/';
}

export function getFaqs(language: Language): Faq[] {
  return language === 'es' ? [
    { question: '¿Qué tipo de proyectos desarrollo?', answer: 'Desarrollo productos web, aplicaciones SaaS e integraciones de IA. Puedo participar desde el diseño y la arquitectura hasta el desarrollo y la puesta en producción.' },
    { question: '¿Trabajo solo o con un equipo?', answer: 'Depende del proyecto. Diseñé, desarrollé y puse en producción DGF Inmobiliaria y Maki Panda íntegramente a través de Totora Studio. En Skillramp definí la arquitectura y lideré el desarrollo junto con diseño, tres programadores, QA y PM.' },
    { question: '¿Puedo trabajar en remoto?', answer: 'Sí. Estoy en Trujillo, Perú, y puedo colaborar en remoto. La sección de contacto reúne mis canales para conversar sobre el proyecto.' },
    { question: '¿Cómo empezamos un proyecto?', answer: 'Cuéntame qué quieres construir y en qué punto estás. Podemos conversar por los canales de contacto para definir el alcance antes de acordar una propuesta.' },
  ] : [
    { question: 'What kinds of projects do I build?', answer: 'I develop web products, SaaS applications and AI integrations. I can contribute from design and architecture through development and production delivery.' },
    { question: 'Do I work independently or with a team?', answer: 'It depends on the project. I independently designed, developed and deployed DGF Inmobiliaria and Maki Panda through Totora Studio. For Skillramp, I defined the architecture and led development with designers, three programmers, QA and a PM.' },
    { question: 'Can I work remotely?', answer: 'Yes. I am based in Trujillo, Peru, and can collaborate remotely. The contact page lists the channels available to discuss your project.' },
    { question: 'How do we start a project?', answer: 'Tell me what you want to build and where you are in the process. We can discuss the scope through the contact channels before agreeing on a proposal.' },
  ];
}

export function getPageData(entryId: string, language: Language): SitePage {
  const path = getWorkspacePath(entryId, language);
  const canonical = SITE_ORIGIN + path;
  const copy = getSiteContent(language);
  const entry = getWorkspaceEntries(copy.projects.featured, language).find(item => item.id === entryId)!;
  const project = copy.projects.featured.find(item => item.id === entryId);
  const skill = PRIMARY_SKILLS.find(item => item.id === entryId);
  const descriptions: Record<string, string> = {
    overview: copy.meta.description,
    about: copy.about.paragraphs.join(' '),
    services: `${copy.services.intro} ${copy.services.offerings.map(item => item.title).join('. ')}.`,
    blog: language === 'es' ? 'Blog de CaleduDev: desarrollo web e IA aplicada, paso a paso. Guías prácticas y ejemplos de código para desarrolladores principiantes e intermedios.' : 'The CaleduDev blog: practical web development and applied AI, step by step. Guides and code examples for beginner and intermediate developers.',
    contact: `${copy.contact.description} ${language === 'es' ? 'Contacta con Carlos Plasencia para proyectos de desarrollo web, SaaS e integración de IA.' : 'Contact Carlos Plasencia for web development, SaaS and AI integration projects.'}`,
    skills: language === 'es' ? 'TypeScript, React, Next.js, NestJS, GraphQL e IA aplicada: explora cómo utilizo mi stack principal en productos web y proyectos reales.' : 'TypeScript, React, Next.js, NestJS, GraphQL and applied AI: explore how I use my core stack in real web products and projects.',
    'skills-more': language === 'es' ? 'Herramientas e integraciones que complementan mi trabajo: Node.js, Astro, bases de datos, Docker, AWS, pagos y APIs para productos web.' : 'Supporting tools and integrations I work with: Node.js, Astro, databases, Docker, AWS, payments and APIs for complete web products.',
  };
  const text = project ? `${project.summary} ${project.contribution}` : skill?.description[language] ?? descriptions[entryId];
  const description = text.length <= 160 ? text : `${text.slice(0,157).replace(/\s+\S*$/, '')}…`;
  const title = entryId === 'overview' ? copy.meta.title : `${entry.title} | ${PROFILE_IDENTITY.name} · ${PROFILE_IDENTITY.alias}`;
  const alternates = {
    es: SITE_ORIGIN + getWorkspacePath(entryId,'es'),
    en: SITE_ORIGIN + getWorkspacePath(entryId,'en'),
    default: SITE_ORIGIN + getWorkspacePath(entryId,'es'),
  };
  const person = { '@id': `${SITE_ORIGIN}/#person` };
  const graph: Record<string, unknown>[] = [
    { '@type': 'Person', ...person, name: PROFILE_IDENTITY.fullName, alternateName: [PROFILE_IDENTITY.name, PROFILE_IDENTITY.alias], jobTitle: 'Senior Full-Stack Developer', url: `${SITE_ORIGIN}/`, image: `${SITE_ORIGIN}/images/carlos-plasencia.png`, sameAs: [CONTACT_CHANNELS.github,CONTACT_CHANNELS.linkedin], knowsAbout: ['TypeScript','React','Next.js','Astro','Node.js','NestJS','GraphQL','Software Architecture','Applied AI'] },
    { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: PROFILE_IDENTITY.name, alternateName: PROFILE_IDENTITY.alias, url: `${SITE_ORIGIN}/`, inLanguage: ['es','en'], about: person },
    { '@type': entryId === 'about' ? 'AboutPage' : entryId === 'contact' ? 'ContactPage' : 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: language, isPartOf: { '@id': `${SITE_ORIGIN}/#website` }, about: person },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'portfolio', item: SITE_ORIGIN + getWorkspacePath('overview',language) },
      ...(entryId === 'overview' ? [] : [{ '@type': 'ListItem', position: 2, name: entry.file, item: canonical }]),
    ] },
  ];
  if (project) graph.push({ '@type': 'CreativeWork', '@id': `${canonical}#case-study`, name: project.title, description: `${project.summary} ${project.contribution}`, creditText: project.contribution, contributor: person, mainEntityOfPage: { '@id': `${canonical}#webpage` }, inLanguage: language, about: project.technologies, url: project.url });
  if (entryId === 'services') {
    graph.push(...copy.services.offerings.map(offering => ({ '@type': 'Service', name: offering.title, description: offering.description, provider: person, url: canonical })));
    graph.push({ '@type': 'FAQPage', '@id': `${canonical}#faq`, inLanguage: language, mainEntity: getFaqs(language).map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) });
  }
  return { entryId,language,path,canonical,title,description,alternates,structuredData: { '@context': 'https://schema.org', '@graph': graph } };
}

export function getStaticPages(): SitePage[] {
  return (['es','en'] as const).flatMap(language => Object.keys(ROUTES).map(id => getPageData(id,language)));
}

export function buildSitemap(): string {
  const urls = getStaticPages().map(page => `  <url><loc>${page.canonical}</loc>${Object.entries(page.alternates).map(([language,url]) => `<xhtml:link rel="alternate" hreflang="${language === 'default' ? 'x-default' : language}" href="${url}"/>`).join('')}</url>`).join('\n');
  const article = `  <url><loc>${SITE_ORIGIN}${BLOG_ARTICLE.path}</loc></url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n${article}\n</urlset>\n`;
}

export function buildLlms(full = false): string {
  const copy = getSiteContent('en');
  const pages = getStaticPages();
  const lines = [`# ${PROFILE_IDENTITY.name} · ${PROFILE_IDENTITY.alias}`, '', '> Senior full-stack developer based in Trujillo, Peru. Web products, SaaS, software architecture and applied AI. Independent development through Totora Studio and architecture/development leadership in team projects.', '', 'This is a personal portfolio, not the source repository of the featured client products. Illustrations and demos are conceptual, not production screenshots or live services. A project contribution must not be interpreted as sole authorship unless explicitly stated.', '', '## Spanish pages', ...pages.filter(page=>page.language==='es').map(page=>`- [${page.title}](${page.canonical}): ${page.description}`), '', '## English pages', ...pages.filter(page=>page.language==='en').map(page=>`- [${page.title}](${page.canonical}): ${page.description}`), '', '## Profiles and studio', `- [GitHub](${CONTACT_CHANNELS.github})`, `- [LinkedIn](${CONTACT_CHANNELS.linkedin})`, `- [Totora Studio](${CONTACT_CHANNELS.studio}): Independent development studio.`, '', '## Optional', `- [Full portfolio context](${SITE_ORIGIN}/llms-full.txt): Expanded public background, project contributions, services and FAQs.`];
  if (full) {
    lines.push('', '## Professional background', ...copy.about.paragraphs, '', '## Services', ...copy.services.offerings.map(item=>`### ${item.title}\n\n${item.description}`), '', '## Project evidence');
    for (const project of copy.projects.featured) lines.push(`### ${project.title}`, '', project.summary, '', `Contribution: ${project.contribution}`, '', ...project.details.map(detail=>`- ${detail}`), '', `Technologies: ${project.technologies.join(', ')}.`, '', `Case study: ${SITE_ORIGIN}${getWorkspacePath(project.id,'en')}`, `Official project: ${project.url}`, ...(project.caseStudy ? [`PDF case study: ${SITE_ORIGIN}${project.caseStudy}`] : []), '');
    lines.push('## Supporting technologies', ADDITIONAL_SKILLS.join(', '), '', '## Questions and answers', ...getFaqs('en').map(faq=>`### ${faq.question}\n\n${faq.answer}`), '', '## Contact', `Use the public contact page: ${SITE_ORIGIN}${getWorkspacePath('contact','en')}`);
  }
  const englishHeading = lines.indexOf('## English pages');
  lines.splice(englishHeading - 1, 0, `- [${BLOG_ARTICLE.title}](${SITE_ORIGIN}${BLOG_ARTICLE.path}): ${BLOG_ARTICLE.description}`);
  return lines.join('\n')+'\n';
}
