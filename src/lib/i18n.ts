export const LANGUAGES = { ES: "es", EN: "en" } as const;
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export const CONTACT_CHANNELS = {
  email: "plasenciacarlos7@gmail.com",
  phone: "+51 942254876",
  whatsapp: "https://wa.me/51942254876",
  linkedin: "https://www.linkedin.com/in/carlos-edu-plasencia-prado/",
  github: "https://github.com/CarlosPlasencia",
  studio: "https://totora.studio/",
} as const;
export interface NavigationCopy {
  about: string;
  services: string;
  experience: string;
  projects: string;
  contact: string;
  menu: string;
  close: string;
  skip: string;
}
export interface HeroCopy {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primary: string;
  secondary: string;
  availability: string;
  location: string;
  role: string;
}
export interface AboutCopy {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  skillsTitle: string;
  skills: string[];
}
export interface Offering {
  title: string;
  description: string;
}
export interface ServicesCopy {
  eyebrow: string;
  title: string;
  intro: string;
  offerings: Offering[];
}
export interface ProjectCopy {
  id: string;
  title: string;
  category: string;
  summary: string;
  contribution: string;
  details: string[];
  technologies: string[];
  url: string;
  caseStudy?: string;
}
export interface ProjectsCopy {
  eyebrow: string;
  title: string;
  intro: string;
  visit: string;
  labelRole: string;
  labelDetails: string;
  featured: ProjectCopy[];
}
export interface ProcessCopy {
  eyebrow: string;
  title: string;
  steps: Offering[];
}
export interface JobCopy {
  company: string;
  position: string;
  period: string;
  description: string;
}
export interface ExperienceCopy {
  eyebrow: string;
  title: string;
  jobs: JobCopy[];
}
export interface ContactCopy {
  eyebrow: string;
  title: string;
  description: string;
  emailLabel: string;
  whatsappLabel: string;
  employment: string;
  whatsappMessage: string;
}
export interface FooterCopy {
  built: string;
  backTop: string;
}
export interface MetaCopy {
  title: string;
  description: string;
}
export interface CvCopy {
  label: string;
  url: string;
}
export interface SiteContent {
  nav: NavigationCopy;
  hero: HeroCopy;
  about: AboutCopy;
  services: ServicesCopy;
  projects: ProjectsCopy;
  process: ProcessCopy;
  experience: ExperienceCopy;
  contact: ContactCopy;
  footer: FooterCopy;
  meta: MetaCopy;
  cv: CvCopy;
}
const skills = ["TypeScript", "React", "Next.js", "Astro", "Node.js", "NestJS", "GraphQL", "MongoDB", "PostgreSQL", "Redis", "Docker", "AWS"];
export const translations: Record<Language, SiteContent> = {
  es: {
    nav: { about: "Sobre mí", services: "Servicios", experience: "Experiencia", projects: "Proyectos", contact: "Contacto", menu: "Abrir menú", close: "Cerrar menú", skip: "Saltar al contenido" },
    hero: {
      eyebrow: "Carlos Plasencia · Desarrollador Full Stack Senior",
      title: "Tu próxima idea,",
      accent: "un producto real.",
      description: "Diseño y desarrollo productos web para empresas y startups. Del primer alcance a producción, con IA aplicada cuando aporta valor.",
      primary: "Hablemos de tu proyecto", secondary: "Explora mi trabajo",
      availability: "Disponible para nuevos proyectos", location: "Trujillo, Perú · Trabajo en remoto",
      role: "Desarrollo Full Stack · IA aplicada · SaaS",
    },
    about: {
      eyebrow: "Quién está detrás", title: "Pienso el producto. Construyo la solución.",
      paragraphs: [
        "Soy Carlos, desarrollador full stack senior y fundador de Totora Studio. Trabajo directamente contigo para convertir una necesidad de negocio en una aplicación útil, desde el diseño y la arquitectura hasta el desarrollo y la puesta en producción.",
        "También he liderado equipos de desarrollo. En Aptura Labs definí la arquitectura y lideré el desarrollo de Skillramp junto con un equipo de diseño, programación, QA y gestión de proyecto.",
        "Mi enfoque combina fundamentos de ingeniería con IA aplicada: integro modelos en productos y uso agentes como apoyo al desarrollo, manteniendo la validación y las decisiones técnicas bajo control humano.",
      ],
      skillsTitle: "Mi stack de trabajo", skills,
    },
    services: {
      eyebrow: "Cómo puedo ayudarte", title: "Ingeniería para llevar tu negocio más lejos.",
      intro: "Una web que puedas gestionar, una aplicación para tu operación o un producto que quieras lanzar. Empezamos por el problema, no por la tecnología.",
      offerings: [
        { title: "Desarrollo web a medida", description: "Diseño, frontend, backend y puesta en producción. Sitios y aplicaciones con paneles de contenido, integraciones y una arquitectura pensada para evolucionar." },
        { title: "IA aplicada a tu producto", description: "Transforma voz y texto en información útil, integra modelos como Claude y automatiza flujos concretos con validaciones y revisión del usuario." },
        { title: "Productos SaaS", description: "Del alcance inicial a una plataforma funcional: arquitectura, desarrollo full stack, pagos y experiencias para distintos tipos de usuarios." },
      ],
    },
    projects: {
      eyebrow: "Trabajo seleccionado", title: "No solo ideas. Productos construidos.",
      intro: "Proyectos de clientes y productos propios. En cada uno encontrarás qué resolvimos y cuál fue mi aporte.",
      visit: "Visitar proyecto", labelRole: "Mi aporte", labelDetails: "Lo que incluye",
      featured: [
        {
          id: "financialia", title: "Financialia", category: "Producto propio · IA aplicada",
          summary: "Finanzas personales con una entrada más natural: registrar un gasto hablando o escribiendo.",
          contribution: "Producto propio de Totora Studio. Lo desarrollé íntegramente, del diseño y la arquitectura a producción.",
          details: ["Convierte voz y texto en transacciones estructuradas mediante Claude.", "Validación en el servidor y confirmación del usuario antes de registrar la transacción.", "Una PWA para gestionar ingresos y gastos."],
          technologies: ["Next.js", "NestJS", "GraphQL", "MongoDB", "Redis", "Claude"],
          url: "https://financialia.xyz/", caseStudy: "/cases/financialia-es.pdf",
        },
        {
          id: "dgf", title: "DGF Inmobiliaria", category: "Proyecto de cliente · Totora Studio",
          summary: "Una web inmobiliaria que el negocio puede mantener y actualizar desde su panel.",
          contribution: "Diseño, desarrollo y puesta en producción realizados íntegramente por mí a través de Totora Studio.",
          details: ["Panel de gestión de contenido (CMS), blog y proyectos inmobiliarios.", "Módulos de embajadores y referidos.", "Datos de contacto y otros contenidos dinámicos y configurables desde el panel."],
          technologies: ["Desarrollo Full Stack", "CMS", "Gestión de contenido"], url: "https://dgfinmobiliaria.com/",
        },
        {
          id: "maki", title: "Maki Panda", category: "Proyecto de cliente · Totora Studio",
          summary: "La experiencia digital del restaurante: carta configurable, locales y pedidos por WhatsApp.",
          contribution: "Diseñé, desarrollé y puse en producción la web completa de forma independiente con Totora Studio.",
          details: ["Menú configurable para mantener la carta actualizada.", "Programa de fidelización.", "Páginas por sede y enlaces para realizar pedidos por WhatsApp."],
          technologies: ["Desarrollo Full Stack", "Carta digital", "Fidelización"], url: "https://makipanda.pe/",
        },
        {
          id: "skillramp", title: "Skillramp", category: "Producto de Aptura Labs · Trabajo en equipo",
          summary: "Una plataforma SaaS para crear y vender academias online, con experiencias para creadores y estudiantes.",
          contribution: "Definí la arquitectura y lideré el desarrollo junto con un equipo de diseño, 3 programadores, QA y PM. Es un producto propio de Aptura Labs.",
          details: ["Backend GraphQL, panel de creadores, LMS y sitio de marketing.", "Arquitectura multi-tenant y CMS de blog sobre PostgreSQL.", "El equipo implementó pagos con Stripe, PayPal y MercadoPago, y notificaciones con Redis."],
          technologies: ["NestJS", "GraphQL", "Next.js", "Astro", "PostgreSQL", "Redis"], url: "https://skillramp.com/",
        },
        {
          id: "reservaya", title: "ReservaYa", category: "Producto propio · Reservas y pagos",
          summary: "Gestión de citas, disponibilidad y cobros para profesionales de la salud.",
          contribution: "Fundador y desarrollador del producto. Construí la plataforma y sus integraciones.",
          details: ["Cobros con MercadoPago.", "Integración con WhatsApp Business API.", "Sincronización bidireccional con Google Calendar."],
          technologies: ["Next.js", "React", "TypeScript", "MercadoPago"], url: "https://reservaya.lat/",
        },
      ],
    },
    process: {
      eyebrow: "Cómo trabajamos", title: "Claridad desde la primera conversación.",
      steps: [
        { title: "Entender", description: "Revisamos tu necesidad, tus usuarios y lo que debe conseguir el producto. Acordamos un alcance claro." },
        { title: "Construir", description: "Diseño y desarrollo con comunicación directa. Revisamos avances y ajustamos con contexto, no a ciegas." },
        { title: "Lanzar", description: "Validamos los flujos importantes, preparamos la puesta en producción y dejamos claro cómo gestionar la solución." },
      ],
    },
    experience: {
      eyebrow: "Trayectoria", title: "Construyendo y liderando, sin dejar de programar.",
      jobs: [
        { company: "Totora Studio", position: "Fundador · Desarrollador Full Stack Senior", period: "Mayo 2026 - Actualidad", description: "Mi estudio independiente de desarrollo. Diseño, desarrollo y puesta en producción de proyectos para clientes como DGF Inmobiliaria y Maki Panda, además de productos propios como Financialia." },
        { company: "Aptura Labs / Skillramp", position: "Full Stack Web Developer & CTO", period: "Noviembre 2025 - Actualidad", description: "Arquitectura y liderazgo de desarrollo del producto propio Skillramp, colaborando con diseño, programación, QA y PM. Co-Founder & CTO de Skillramp desde febrero de 2026." },
        { company: "Digenio", position: "Co-Fundador & CTO", period: "Mayo 2020 - Enero 2026", description: "Predecesor de Aptura Labs. Lideré un equipo para desarrollar Wayfrontier, una plataforma que organizaba datos y documentos para la constitución de LLC en EE. UU. mediante un agente local. Proyecto descontinuado. Stack: NestJS, GraphQL, Next.js y MongoDB." },
        { company: "Experiencia anterior", position: "Desarrollador Full Stack", period: "2017 - 2020", description: "Desarrollo web en Escuela Americana de Innovación, Tarefa.co, SoftButterfly y Cloud Water." },
      ],
    },
    contact: {
      eyebrow: "Hablemos", title: "¿Qué quieres construir?",
      description: "Cuéntame qué necesita tu negocio, en qué punto estás y qué te gustaría resolver. Te ayudaré a definir el siguiente paso.",
      emailLabel: "Escríbeme por correo", whatsappLabel: "Conversemos por WhatsApp",
      employment: "También abierto a oportunidades senior a tiempo completo o parcial, con foco en desarrollo e IA aplicada.",
      whatsappMessage: "Hola Carlos, me gustaría conversar sobre un proyecto.",
    },
    footer: { built: "Diseñado y desarrollado por Carlos Plasencia · Astro + React", backTop: "Volver arriba" },
    meta: { title: "Carlos Plasencia | Desarrollo Full Stack e IA aplicada", description: "Desarrollo productos web para empresas y startups: diseño, arquitectura, programación e IA aplicada. Conoce mis proyectos y hablemos de tu idea." },
    cv: { label: "Descargar CV en español", url: "/cv/carlos-plasencia-es.pdf" },
  },
  en: {
    nav: { about: "About", services: "Services", experience: "Experience", projects: "Projects", contact: "Contact", menu: "Open menu", close: "Close menu", skip: "Skip to content" },
    hero: {
      eyebrow: "Carlos Plasencia · Senior Full Stack Developer", title: "Your next idea,", accent: "a real product.",
      description: "I design and develop web products for businesses and startups. From the initial scope to production, with applied AI where it adds value.",
      primary: "Let's talk about your project", secondary: "Explore my work", availability: "Available for new projects",
      location: "Trujillo, Peru · Working remotely", role: "Full Stack Development · Applied AI · SaaS",
    },
    about: {
      eyebrow: "The person behind the work", title: "Product thinking. Hands-on engineering.",
      paragraphs: [
        "I'm Carlos, a senior full stack developer and founder of Totora Studio. I work directly with you to turn a business need into a useful application, from design and architecture to development and deployment.",
        "I've also led development teams. At Aptura Labs, I defined the architecture and led Skillramp's development alongside a team spanning design, engineering, QA and project management.",
        "My approach combines software engineering fundamentals with applied AI: I integrate models into products and use agents to support development, keeping validation and technical decisions under human control.",
      ],
      skillsTitle: "My working stack", skills,
    },
    services: {
      eyebrow: "How I can help", title: "Engineering that moves your business forward.",
      intro: "A website you can manage, an application for your operations or a product you want to launch. We start with the problem, not the technology.",
      offerings: [
        { title: "Custom web development", description: "Design, frontend, backend and deployment. Websites and applications with content dashboards, integrations and an architecture built to evolve." },
        { title: "Applied AI for your product", description: "Turn voice and text into useful information, integrate models like Claude and automate specific workflows with validation and user review." },
        { title: "SaaS product development", description: "From the initial scope to a working platform: architecture, full stack development, payments and experiences for different user roles." },
      ],
    },
    projects: {
      eyebrow: "Selected work", title: "Not just ideas. Products built.", intro: "Client projects and my own products. See the problem each one addresses and exactly what I contributed.",
      visit: "Visit project", labelRole: "My contribution", labelDetails: "What's included",
      featured: [
        {
          id: "financialia", title: "Financialia", category: "Own product · Applied AI", summary: "Personal finance with a more natural way to record expenses: speaking or typing.",
          contribution: "My own product under Totora Studio. I built it entirely, from design and architecture to production.",
          details: ["Turns voice and text into structured transactions using Claude.", "Server-side validation and user confirmation before recording a transaction.", "A PWA for managing income and expenses."],
          technologies: ["Next.js", "NestJS", "GraphQL", "MongoDB", "Redis", "Claude"], url: "https://financialia.xyz/", caseStudy: "/cases/financialia-en.pdf",
        },
        {
          id: "dgf", title: "DGF Inmobiliaria", category: "Client project · Totora Studio", summary: "A real estate website the business can maintain and update from its own dashboard.",
          contribution: "Designed, developed and deployed entirely by me through Totora Studio.",
          details: ["Content management system (CMS), blog and real estate projects.", "Ambassador and referral modules.", "Contact details and other dynamic content configurable from the dashboard."],
          technologies: ["Full Stack Development", "CMS", "Content Management"], url: "https://dgfinmobiliaria.com/",
        },
        {
          id: "maki", title: "Maki Panda", category: "Client project · Totora Studio", summary: "The restaurant's digital experience: a configurable menu, locations and WhatsApp ordering links.",
          contribution: "Independently designed, developed and deployed the complete website through Totora Studio.",
          details: ["Configurable menu to keep the restaurant's offering up to date.", "Loyalty program.", "Location pages and links to place orders via WhatsApp."],
          technologies: ["Full Stack Development", "Digital Menu", "Loyalty"], url: "https://makipanda.pe/",
        },
        {
          id: "skillramp", title: "Skillramp", category: "Aptura Labs product · Team delivery", summary: "A SaaS platform to create and sell online academies, with experiences for creators and students.",
          contribution: "Defined the architecture and led development with a design team, 3 developers, QA and a PM. Skillramp is an in-house product of Aptura Labs.",
          details: ["GraphQL backend, creator dashboard, student LMS and marketing website.", "Multi-tenant architecture and a blog CMS on PostgreSQL.", "The team implemented Stripe, PayPal and MercadoPago payments, plus Redis-backed notifications."],
          technologies: ["NestJS", "GraphQL", "Next.js", "Astro", "PostgreSQL", "Redis"], url: "https://skillramp.com/",
        },
        {
          id: "reservaya", title: "ReservaYa", category: "Own product · Booking and payments", summary: "Appointments, availability and payments for health professionals.",
          contribution: "Founder and developer of the product. I built the platform and its integrations.",
          details: ["MercadoPago payments.", "WhatsApp Business API integration.", "Two-way synchronization with Google Calendar."],
          technologies: ["Next.js", "React", "TypeScript", "MercadoPago"], url: "https://reservaya.lat/",
        },
      ],
    },
    process: {
      eyebrow: "Working together", title: "Clarity from our first conversation.",
      steps: [
        { title: "Understand", description: "We discuss your needs, users and the outcome your product should deliver. Then we agree on a clear scope." },
        { title: "Build", description: "Design and development with direct communication. We review progress and make adjustments with context, not guesswork." },
        { title: "Launch", description: "We validate important workflows, prepare deployment and make it clear how to manage the solution." },
      ],
    },
    experience: {
      eyebrow: "Experience", title: "Building and leading, while staying hands-on.",
      jobs: [
        { company: "Totora Studio", position: "Founder · Senior Full Stack Developer", period: "May 2026 - Present", description: "My independent development studio. Design, development and deployment for clients including DGF Inmobiliaria and Maki Panda, alongside my own products such as Financialia." },
        { company: "Aptura Labs / Skillramp", position: "Full Stack Web Developer & CTO", period: "November 2025 - Present", description: "Architecture and development leadership for the in-house product Skillramp, collaborating with design, engineering, QA and a PM. Co-Founder & CTO of Skillramp since February 2026." },
        { company: "Digenio", position: "Co-Founder & CTO", period: "May 2020 - January 2026", description: "Predecessor to Aptura Labs. I led a team developing Wayfrontier, which organized user information and documents for US LLC formation through a local agent. The project is discontinued. Stack: NestJS, GraphQL, Next.js and MongoDB." },
        { company: "Earlier experience", position: "Full Stack Developer", period: "2017 - 2020", description: "Web development at Escuela Americana de Innovación, Tarefa.co, SoftButterfly and Cloud Water." },
      ],
    },
    contact: {
      eyebrow: "Let's talk", title: "What do you want to build?",
      description: "Tell me what your business needs, where you are now and what you want to solve. I'll help you define the next step.",
      emailLabel: "Send me an email", whatsappLabel: "Let's talk on WhatsApp",
      employment: "Also open to senior full-time or part-time opportunities focused on development and applied AI.",
      whatsappMessage: "Hi Carlos, I'd like to discuss a project.",
    },
    footer: { built: "Designed and developed by Carlos Plasencia · Astro + React", backTop: "Back to top" },
    meta: { title: "Carlos Plasencia | Full Stack Development & Applied AI", description: "I build web products for businesses and startups: design, architecture, development and applied AI. Explore my work and let's discuss your idea." },
    cv: { label: "Download CV in English", url: "/cv/carlos-plasencia-en.pdf" },
  },
};
export function isLanguage(value: unknown): value is Language {
  return value === LANGUAGES.ES || value === LANGUAGES.EN;
}
export function resolveLanguage(saved: unknown, browserLanguage?: string): Language {
  if (isLanguage(saved))
    return saved;
  return browserLanguage?.toLowerCase().split(/[-_]/)[0] === LANGUAGES.EN ? LANGUAGES.EN : LANGUAGES.ES;
}
export function getLanguageFromBrowser(): Language {
  if (typeof window === "undefined")
    return LANGUAGES.ES;
  return resolveLanguage(null, window.navigator.language);
}
export function getSiteContent(language: Language): SiteContent {
  return translations[language];
}
export function getTranslation<T = string>(language: Language, key: string): T {
  let value: unknown = getSiteContent(language);
  for (const segment of key.split(".")) {
    if (typeof value !== "object" || value === null || !Object.hasOwn(value, segment)) {
      return key as unknown as T;
    }
    value = (value as Record<string, unknown>)[segment];
  }
  return (value ?? key) as T;
}
