export const PRIMARY_SKILLS = [
  { id: 'skill-typescript', title: 'TypeScript', file: 'typescript.ts', tools: ['TypeScript'], description: { es: 'Contratos claros entre las piezas del producto. Tipos para hacer explícitos los datos, estados y límites del sistema.', en: 'Clear contracts between product layers. Types that make data, states and system boundaries explicit.' }, project: 'financialia' },
  { id: 'skill-frontend', title: 'React / Next.js', file: 'frontend.tsx', tools: ['React', 'Next.js', 'Astro'], description: { es: 'Interfaces conectadas a procesos reales: paneles de gestión, experiencias para distintos usuarios y aplicaciones web completas.', en: 'Interfaces connected to real workflows: management dashboards, role-specific experiences and complete web applications.' }, project: 'maki' },
  { id: 'skill-backend', title: 'NestJS / GraphQL', file: 'backend.graphql', tools: ['NestJS', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis'], description: { es: 'Arquitectura y lógica del lado del servidor. APIs, validación e integraciones para conectar la interfaz con la operación del negocio.', en: 'Server-side architecture and business logic. APIs, validation and integrations connecting the interface to business operations.' }, project: 'skillramp' },
  { id: 'skill-ai', title: 'Applied AI', file: 'applied-ai.ts', tools: ['Claude', 'AI agents'], description: { es: 'Modelos al servicio de un flujo concreto, con validación y revisión humana. Agentes como apoyo al desarrollo, no como sustituto del criterio técnico.', en: 'Models serving a specific workflow, with validation and human review. Agents supporting development, not replacing technical judgment.' }, project: 'financialia' },
] as const;

// Supporting tools and integrations already evidenced by the portfolio's projects.
export const ADDITIONAL_SKILLS = ['Node.js', 'Astro', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'MercadoPago', 'WhatsApp Business API', 'Google Calendar API'] as const;

export async function copyContactEmail(email: string, writeText?: (value: string) => Promise<void>): Promise<boolean> {
  if (!writeText) return false;
  try { await writeText(email); return true; } catch { return false; }
}

export const PROJECT_SCENES = { financialia: 'ledger', dgf: 'architecture', maki: 'menu', skillramp: 'academy', reservaya: 'calendar' } as const;
export interface WorkspaceEntry { id: string; title: string; file: string; group: string; }
interface ProjectIdentity { id: string; title: string; }
export function getWorkspaceEntries(projects: readonly ProjectIdentity[], language: string): WorkspaceEntry[] {
  const es = language === 'es';
  return [
    { id: 'overview', title: es ? 'Inicio' : 'Overview', file: 'overview.tsx', group: 'src' },
    { id: 'about', title: es ? 'Sobre mí' : 'About me', file: 'about.md', group: 'src' },
    ...projects.map(project => ({ ...project, file: `${project.id}.project`, group: 'projects' })),
    { id: 'skills', title: es ? 'Skills principales' : 'Core skills', file: 'index.ts', group: 'skills' },
    ...PRIMARY_SKILLS.map(skill => ({ id: skill.id, title: skill.title, file: skill.file, group: 'skills' })),
    { id: 'skills-more', title: es ? 'Más herramientas' : 'More tools', file: 'more.json', group: 'skills' },
    { id: 'services', title: es ? 'Servicios' : 'Services', file: 'services.ts', group: 'src' },
    { id: 'contact', title: es ? 'Contacto' : 'Contact', file: 'contact.ts', group: 'src' },
  ];
}
export function getAdjacentEntries(entries: readonly WorkspaceEntry[], active: string) {
  const index = entries.findIndex(entry => entry.id === active);
  if (index < 0) return {};
  return { previous: entries[index - 1], next: entries[index + 1] };
}

export const INITIAL_LOCAL_DEMO = { content: 'Proyecto Horizonte', published: false, cart: 0, points: 0, student: false, lessonComplete: false, slot: '', reserved: false };
export type LocalDemoState = typeof INITIAL_LOCAL_DEMO;
export const LOCAL_ACTION = { CONTENT: 'content', PUBLISH: 'publish', ADD: 'add', CHECKOUT: 'checkout', ROLE: 'role', LESSON: 'lesson', SLOT: 'slot', RESERVE: 'reserve', RESET: 'reset' } as const;
interface LocalDemoAction { type: (typeof LOCAL_ACTION)[keyof typeof LOCAL_ACTION]; value?: string; }
export function updateLocalDemo(state: LocalDemoState, action: LocalDemoAction): LocalDemoState {
  switch (action.type) {
    case LOCAL_ACTION.CONTENT: return { ...state, content: (action.value ?? '').slice(0, 70), published: false };
    case LOCAL_ACTION.PUBLISH: return { ...state, published: true };
    case LOCAL_ACTION.ADD: return { ...state, cart: state.cart + 1 };
    case LOCAL_ACTION.CHECKOUT: return { ...state, cart: 0, points: state.points + state.cart * 10 };
    case LOCAL_ACTION.ROLE: return { ...state, student: !state.student };
    case LOCAL_ACTION.LESSON: return { ...state, lessonComplete: true };
    case LOCAL_ACTION.SLOT: return { ...state, slot: action.value ?? '', reserved: false };
    case LOCAL_ACTION.RESERVE: return state.slot ? { ...state, reserved: true } : state;
    case LOCAL_ACTION.RESET: return { ...INITIAL_LOCAL_DEMO };
  }
}
