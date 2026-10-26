import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Braces, Check, ChevronDown, ChevronRight, Code2, FileCode2, Folder, FolderOpen, GitBranch, Github, Languages, MessageCircle, Search, X, Zap } from 'lucide-react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';
import { CONTACT_CHANNELS } from '../../lib/i18n';
import { getAdjacentEntries, getWorkspaceEntries, PRIMARY_SKILLS, ADDITIONAL_SKILLS } from '../../lib/workspace-content';
import ProjectDemos from './ProjectDemos';
import ProjectVisual from './ProjectVisual';
import AgentTerminals from './AgentTerminals';
import ContactPage from './ContactPage';

const HOME = 'overview';
interface WorkspaceProps { initialEntry?: string; }
function Workspace({ initialEntry = HOME }: WorkspaceProps) {
  const { copy, language, setLanguage } = useLanguage();
  const es = language === 'es';
  const entries = getWorkspaceEntries(copy.projects.featured, language);
  const [active, setActive] = useState(initialEntry);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [lastEntry, setLastEntry] = useState(initialEntry === HOME ? '' : initialEntry);
  const [query, setQuery] = useState('');
  const [motion, setMotion] = useState(true);
  const commandDialog = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const entry = entries.find(item => item.id === active) ?? entries[0];
  const project = copy.projects.featured.find(item => item.id === active);
  const skill = PRIMARY_SKILLS.find(item => item.id === active);
  const openTab = entries.find(item => item.id === lastEntry);
  const results = entries.filter(item => `${item.title} ${item.file} ${item.group}`.toLowerCase().includes(query.toLowerCase()));
  const adjacent = getAdjacentEntries(entries, active);
  const otherTools = ADDITIONAL_SKILLS;

  useEffect(() => {
    const media = window.matchMedia('(min-width: 801px)');
    const update = () => setExplorerOpen(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); commandDialog.current?.showModal(); }
      if (event.key === 'Escape' && !commandDialog.current?.open) setExplorerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const restore = () => {
      const id = window.location.hash.slice(1);
      if (getWorkspaceEntries(copy.projects.featured, 'es').some(item => item.id === id)) {
        setActive(id); if (id !== HOME) setLastEntry(id);
      }
    };
    restore(); window.addEventListener('hashchange', restore);
    return () => window.removeEventListener('hashchange', restore);
  }, [copy.projects.featured]);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [active]);

  function openEntry(id: string, focusContent = false) {
    if (!entries.some(item => item.id === id)) return;
    setActive(id); if (id !== HOME) setLastEntry(id);
    if (window.matchMedia('(max-width: 800px)').matches) setExplorerOpen(false);
    commandDialog.current?.close(); setQuery('');
    window.history.replaceState(null, '', `#${id}`);
    if (focusContent) window.requestAnimationFrame(() => contentRef.current?.focus());
  }
  function navigateTabs(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = tabs.findIndex(tab => tab === document.activeElement);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[index]?.focus(); tabs[index]?.click();
  }
  function fileButton(id: string) {
    const file = entries.find(item => item.id === id);
    if (!file) return null;
    return <button key={id} className={`ws-file ${active === id ? 'selected' : ''}`} aria-current={active === id ? 'page' : undefined} onClick={() => openEntry(id, true)}><FileCode2 size={14} /><span>{file.file}</span></button>;
  }

  return <div className={`workspace ${motion ? '' : 'ws-paused'}`}>
    <a className="ws-skip" href="#workspace-content">{copy.nav.skip}</a>
    <header className="ws-titlebar">
      <div className="ws-brand"><span className="ws-monogram">cp<span>_</span></span><span>carlos<span className="ws-dim"> / workspace</span></span></div>
      <button className="ws-command" aria-label={es ? 'Buscar secciones y proyectos' : 'Search sections and projects'} onClick={() => commandDialog.current?.showModal()}><Search size={14} /><span>{es ? 'Explora el workspace' : 'Explore the workspace'}</span><kbd>⌘ K</kbd></button>
      <div className="ws-title-actions"><button className="ws-language" onClick={() => setLanguage(es ? 'en' : 'es')} aria-label={es ? 'Switch to English' : 'Cambiar a español'}><Languages size={15} />{es ? 'ES → EN' : 'EN → ES'}</button></div>
    </header>
    <div className={`ws-body ${explorerOpen ? '' : 'explorer-collapsed'}`}>
      <nav className="ws-activity" aria-label={es ? 'Herramientas del workspace' : 'Workspace tools'}>
        <button className={`ws-tool ${explorerOpen ? 'active' : ''}`} aria-label={es ? 'Mostrar explorador' : 'Show explorer'} aria-expanded={explorerOpen} aria-controls="workspace-explorer" onClick={() => setExplorerOpen(value => !value)}><FolderOpen size={21} /></button>
        <button className="ws-tool" aria-label={es ? 'Buscar' : 'Search'} onClick={() => commandDialog.current?.showModal()}><Search size={21} /></button>
        <button className="ws-tool" aria-label={es ? 'Volver al inicio' : 'Back to overview'} onClick={() => openEntry(HOME, true)}><Code2 size={22} /></button>
        <a className="ws-tool" href={CONTACT_CHANNELS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={20} /></a>
        <div className="ws-rail-bottom"><button className="ws-tool ws-whatsapp" onClick={() => openEntry('contact', true)} aria-label={es ? 'Ver opciones de contacto' : 'View contact options'} title={es ? 'Contacto' : 'Contact'}><MessageCircle size={21} /><span className="ws-whatsapp-dot" /></button><img src="/images/carlos-plasencia.png" width="28" height="28" alt="Carlos Plasencia" /></div>
      </nav>
      <aside id="workspace-explorer" className={`ws-explorer ${explorerOpen ? 'is-open' : ''}`}>
        <div className="ws-explorer-heading"><span>EXPLORER</span><button aria-label={es ? 'Cerrar explorador' : 'Close explorer'} onClick={() => setExplorerOpen(false)}><X size={15} /></button></div>
        <div className="ws-explorer-scroll">
          <div className="ws-folder-title"><ChevronDown size={13} /><span>CARLOS-PLASENCIA</span></div>
          {fileButton(HOME)}{fileButton('about')}
          <div className="ws-folder-title nested"><ChevronDown size={13} /><Folder size={15} /><span>projects</span><span className="ws-count">05</span></div>
          <div className="ws-project-files">{copy.projects.featured.map(item => fileButton(item.id))}</div>
          <div className="ws-folder-title nested"><ChevronDown size={13} /><Folder size={15} /><span>skills</span><span className="ws-count">04 +</span></div>
          <div className="ws-project-files">{fileButton('skills')}{PRIMARY_SKILLS.map(item => fileButton(item.id))}{fileButton('skills-more')}</div>
          {fileButton('services')}
          {fileButton('contact')}
          <a className="ws-file" href={copy.cv.url} target="_blank" rel="noopener noreferrer" aria-label={es ? 'Abrir CV en nueva pestaña' : 'Open CV in a new tab'}><ArrowUpRight size={14} /><span>resume.pdf</span></a>
          <div className="ws-sidebar-note"><span className="ws-section-caption">{es ? 'ACTUALMENTE' : 'CURRENTLY'}</span><p><span className="ws-availability-dot" />{copy.hero.availability}</p><a href={CONTACT_CHANNELS.studio} target="_blank" rel="noopener noreferrer">↳ Totora Studio <ArrowUpRight size={12} /></a></div>
        </div>
      </aside>
      <div className="ws-editor">
        <div className="ws-tabs" role="tablist" aria-label={es ? 'Archivos abiertos' : 'Open files'} onKeyDown={navigateTabs}>
          <button id="tab-overview" role="tab" aria-controls="workspace-content" aria-selected={active === HOME} tabIndex={active === HOME ? 0 : -1} className={active === HOME ? 'is-active' : ''} onClick={() => openEntry(HOME)}><FileCode2 size={14} />overview.tsx<span className="ws-tab-dot" /></button>
          {openTab ? <button id="tab-entry" role="tab" aria-controls="workspace-content" aria-selected={active !== HOME} tabIndex={active !== HOME ? 0 : -1} className={active !== HOME ? 'is-active' : ''} onClick={() => openEntry(openTab.id)}><Braces size={14} />{openTab.file}</button> : null}
          <a href={copy.cv.url} target="_blank" rel="noopener noreferrer" aria-label={es ? 'Abrir CV en nueva pestaña' : 'Open CV in a new tab'} className="ws-tab-cv"><ArrowUpRight size={13} />CV</a>
        </div>
        <div className="ws-breadcrumb"><span>portfolio</span><ChevronRight size={12} /><span>{entry.group}</span><ChevronRight size={12} /><span>{entry.file}</span><span className="ws-breadcrumb-end"><span className="ws-availability-dot" />{es ? 'Disponible para colaborar' : 'Available for collaboration'}</span></div>
        <main ref={contentRef} id="workspace-content" role="tabpanel" aria-labelledby={active === HOME ? 'tab-overview' : 'tab-entry'} className="ws-canvas" tabIndex={-1}>
          {active === HOME || project ? <>
            <section className="ws-intro" key={active} aria-labelledby="ws-main-title">
              <div className="ws-line-numbers" aria-hidden="true">01<br />02<br />03<br />04<br />05<br />06<br />07<br />08<br />09<br />10<br />11<br />12<br />13<br />14</div>
              <div className="ws-intro-copy">
                <div className="ws-comment"><span>//</span>{project ? project.category : (es ? 'Un desarrollador. De la idea a producción.' : 'One developer. From idea to production.')}</div>
                {project ? <><p className="ws-project-prefix">export project <span>=</span></p><h1 id="ws-main-title" className="ws-project-name">{project.title}<span className="ws-cursor">_</span></h1><p className="ws-description">{project.summary}</p><p className="ws-contribution">{project.contribution}</p><div className="ws-stack-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div><div className="ws-hero-actions"><a className="ws-primary" href={project.url} target="_blank" rel="noopener noreferrer">{copy.projects.visit}<ArrowUpRight size={16} /></a>{project.caseStudy ? <a className="ws-secondary" href={project.caseStudy} download>{es ? 'Caso en PDF' : 'PDF case study'}<ArrowDownToLine size={14} /></a> : null}</div></> : <><p className="ws-role">Senior Full-Stack Developer <span>×</span> Applied AI</p><h1 id="ws-main-title">Carlos<span className="ws-name-second">Plasencia<span className="ws-cursor">_</span></span></h1><p className="ws-description">{es ? 'Construyo productos web completos. Diseño la arquitectura, escribo el código y lo llevo a producción.' : 'I build complete web products. I design the architecture, write the code and take it to production.'}</p><div className="ws-hero-actions"><button className="ws-primary" onClick={() => openEntry('financialia', true)}>{es ? 'Explora mi trabajo' : 'Explore my work'}<ArrowRight size={16} /></button><button className="ws-secondary ws-contact-trigger" onClick={() => openEntry('contact', true)}>{es ? 'Construyamos algo' : 'Let’s build something'}<ArrowUpRight size={15} /></button></div><div className="ws-intro-foot"><span><span className="ws-code-mark">&lt;/&gt;</span>TypeScript · React · Node.js</span><button className="ws-text-link" onClick={() => openEntry('about', true)}>{es ? 'Conoce a la persona detrás del código' : 'Meet the person behind the code'}<ArrowRight size={12} /></button></div></>}
              </div>
              {project ? <ProjectVisual id={project.id} title={project.title} es={es} /> : <div className="ws-system-scene" aria-hidden="true">
              <div className="ws-scene-label">
                <span>BUILD IN LAYERS</span>
                <span>01—03</span>
              </div>
              <div className="ws-blueprint-grid" />
              <div className="ws-code-stack">
                <div className="ws-code-layer layer-data">
                  <div className="ws-layer-title">
                    <Braces size={12} />
                    <span>model.ts</span>
                    <span>03</span>
                  </div>
                  <pre>
                    <span className="syntax-muted">type</span> Product = {'{'}<br />  idea: <span className="syntax-blue">string</span>;<br />  impact: <span className="syntax-blue">real</span>;<br />{'}'}</pre>
                </div>
                <div className="ws-code-layer layer-api">
                  <div className="ws-layer-title">
                    <GitBranch size={12} />
                    <span>api.graphql</span>
                    <span>02</span>
                  </div>
                  <pre>
                    <span className="syntax-blue">mutation</span> Build {'{'}<br />  createProduct(input)<br />  <span className="syntax-muted">→ validated</span>
                    <br />{'}'}</pre>
                </div>
                <div className="ws-code-layer layer-ui">
                  <div className="ws-layer-title">
                    <FileCode2 size={12} />
                    <span>interface.tsx</span>
                    <span>01</span>
                  </div>
                  <pre>
                    <span className="syntax-blue">export default</span>
                    <br />function <span className="syntax-white">YourNextProduct</span>() {'{'}<br />  return <span className="syntax-blue">&lt;Reality /&gt;</span>;<br />{'}'}</pre>
                  <div className="ws-layer-footer">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
              <div className="ws-scene-axis">
                <span>DESIGN</span>
                <span>DEVELOP</span>
                <span>DEPLOY <ArrowUpRight size={10} />
                </span>
              </div>
            </div>}
            </section>
            {project ? <><div className="ws-project-details"><span className="ws-section-caption">{copy.projects.labelDetails}</span><ul>{project.details.map(detail => <li key={detail}><Check size={13} />{detail}</li>)}</ul></div><ProjectDemos key={project.id} id={project.id} es={es} motion={motion} /></> : <AgentTerminals es={es} />}
          </> : active === 'about' ? <section className="ws-document ws-about" aria-labelledby="ws-main-title"><div className="ws-doc-heading"><span className="ws-comment">// {copy.about.eyebrow}</span><h1 id="ws-main-title">{es ? 'Más que código.' : 'Beyond the code.'}</h1></div><div className="ws-about-grid"><div><h2>{copy.about.title}</h2>{copy.about.paragraphs.map(text => <p key={text}>{text}</p>)}<a className="ws-secondary" href={copy.cv.url} target="_blank" rel="noopener noreferrer" aria-label={es ? 'Abrir CV en nueva pestaña' : 'Open CV in a new tab'}>{es ? 'Ver CV' : 'View CV'}<ArrowUpRight size={15} /></a></div><figure className="ws-portrait"><img src="/images/carlos-plasencia.png" width="400" height="400" alt="Carlos Plasencia" /><figcaption>CARLOS PLASENCIA <span>Trujillo, Perú / Remote</span></figcaption></figure></div><div className="ws-experience"><span className="ws-section-caption">{copy.experience.eyebrow}</span>{copy.experience.jobs.map(job => <article key={job.company}><span>{job.period}</span><div><h3>{job.company}</h3><strong>{job.position}</strong><p>{job.description}</p></div></article>)}</div></section>
          : active === 'skills' || active === 'skills-more' || skill ? <section className="ws-document ws-skills" aria-labelledby="ws-main-title"><span className="ws-comment">// stack / {skill ? skill.file : active === 'skills-more' ? 'more.json' : 'index.ts'}</span><h1 id="ws-main-title">{skill ? skill.title : active === 'skills-more' ? (es ? 'Más herramientas.' : 'More tools.') : (es ? 'Mi stack principal.' : 'My core stack.')}</h1>{skill ? <><p className="ws-doc-lead">{skill.description[language]}</p><div className="ws-skill-tools">{skill.tools.map(tool => <span key={tool}>{tool}</span>)}</div><div className="ws-skill-proof"><Code2 size={25} /><div><span className="ws-section-caption">{es ? 'DEL CONCEPTO AL PRODUCTO' : 'FROM CONCEPT TO PRODUCT'}</span><p>{es ? 'Explora un proyecto donde aplico estas herramientas.' : 'Explore a project where I apply these tools.'}</p><button className="ws-text-link" onClick={() => openEntry(skill.project, true)}>{copy.projects.featured.find(item => item.id === skill.project)?.title}<ArrowUpRight size={14} /></button></div></div><p className="ws-skill-note">{es ? 'Sin porcentajes de dominio: el trabajo y las decisiones cuentan la historia.' : 'No proficiency percentages: the work and decisions tell the story.'}</p></> : active === 'skills-more' ? <><p className="ws-doc-lead">{es ? 'Tecnologías e integraciones que complementan mi trabajo, del servidor a la puesta en producción.' : 'Supporting technologies and integrations I work with, from backend development to production.'}</p><ul className="ws-more-tools">{otherTools.map(tool => <li key={tool}><span>→</span>{tool}</li>)}</ul></> : <><p className="ws-doc-lead">{es ? 'Selecciona un archivo para ver cómo lo aplico en productos reales.' : 'Open a file to see how I apply it in real products.'}</p><div className="ws-skill-directory">{PRIMARY_SKILLS.map((item, index) => <button key={item.id} onClick={() => openEntry(item.id, true)}><span>0{index + 1}</span><div><h2>{item.title}</h2><p>{item.description[language]}</p><small>{item.file}</small></div><ArrowUpRight size={21} /></button>)}</div><button className="ws-text-link" onClick={() => openEntry('skills-more', true)}>{es ? 'Ver las demás herramientas' : 'View other tools'}<ArrowRight size={14} /></button></>}</section>
          : active === 'contact' ? <ContactPage es={es} message={copy.contact.whatsappMessage} cvUrl={copy.cv.url} />
          : <section className="ws-document ws-services" aria-labelledby="ws-main-title"><span className="ws-comment">// {copy.services.eyebrow}</span><h1 id="ws-main-title">{es ? 'Construyamos algo útil.' : 'Let’s build something useful.'}</h1><p className="ws-doc-lead">{copy.services.intro}</p><div className="ws-service-list">{copy.services.offerings.map((offering, index) => <article key={offering.title}><span>0{index + 1}</span><div><h2>{offering.title}</h2><p>{offering.description}</p></div><ArrowUpRight size={21} /></article>)}</div><div className="ws-process"><h2>{copy.process.title}</h2><div>{copy.process.steps.map((step, index) => <article key={step.title}><span>0{index + 1} / {step.title}</span><p>{step.description}</p></article>)}</div></div><div className="ws-service-contact"><div><h2>{copy.contact.title}</h2><p>{copy.contact.description}</p></div><button className="ws-primary" onClick={() => openEntry('contact', true)}><MessageCircle size={17} />{es ? 'Ver opciones de contacto' : 'View contact options'}<ArrowRight size={15} /></button></div></section>}
          <nav className="ws-page-navigation" aria-label={es ? 'Navegación entre secciones y proyectos' : 'Section and project navigation'}>
            {adjacent.previous ? <button onClick={() => openEntry(adjacent.previous!.id, true)}><ArrowLeft size={18} /><span><small>{es ? 'Anterior' : 'Previous'}</small>{adjacent.previous.title}</span></button> : <span />}
            {adjacent.next ? <button onClick={() => openEntry(adjacent.next!.id, true)}><span><small>{es ? 'Siguiente' : 'Next'}</small>{adjacent.next.title}</span><ArrowRight size={18} /></button> : <button onClick={() => openEntry(HOME, true)}><span><small>{es ? 'Volver a' : 'Back to'}</small>{es ? 'Inicio' : 'Overview'}</span><ArrowRight size={18} /></button>}
          </nav>
        </main>
      </div>
    </div>
    <footer className="ws-statusbar"><div><GitBranch size={12} /><span>main</span><span className="ws-status-separator" /><span><Check size={12} />{es ? 'Vista previa local' : 'Local preview'}</span></div><div><span className="ws-status-location">Trujillo, PE ↗</span><span>UTF-8</span><span>TypeScript React</span><span className="ws-status-blue"><Zap size={11} />{es ? 'Construyendo' : 'Building'}</span></div></footer>
    <dialog ref={commandDialog} className="ws-command-dialog" onClose={() => setQuery('')} aria-label={es ? 'Buscar en el workspace' : 'Search the workspace'}><form onSubmit={event => { event.preventDefault(); if (results[0]) openEntry(results[0].id, true); }}><div className="ws-command-input"><Search size={18} /><input autoFocus aria-label={es ? 'Sección, skill o proyecto' : 'Section, skill or project'} placeholder={es ? 'Busca una sección, skill o proyecto…' : 'Find a section, skill or project…'} value={query} onChange={event => setQuery(event.target.value)} /><button type="button" onClick={() => commandDialog.current?.close()} aria-label={es ? 'Cerrar buscador' : 'Close search'}><kbd>esc</kbd></button></div><div className="ws-command-results">{results.map(item => <button type="button" key={item.id} onClick={() => openEntry(item.id, true)}><Braces size={16} /><span>{item.title}<small>{item.group} / {item.file}</small></span><ArrowRight size={15} /></button>)}{!results.length ? <p>{es ? 'Sin resultados.' : 'No results.'}</p> : null}</div></form></dialog>
  </div>;
}

export default function WorkspacePreview(props: WorkspaceProps) { return <LanguageProvider><Workspace {...props} /></LanguageProvider>; }
