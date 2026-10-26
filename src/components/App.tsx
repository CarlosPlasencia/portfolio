import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Code2, Download, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import { CONTACT_CHANNELS } from "../lib/i18n";
function Portfolio() {
  const { copy, language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const isSpanish = language === "es";
  const nav = [["projects", copy.nav.projects], ["services", copy.nav.services], ["about", copy.nav.about], ["experience", copy.nav.experience]];
  useEffect(() => {
    if (!menuOpen)
      return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  return <>
    <a className="skip-link" href="#main">{copy.nav.skip}</a>
    <header className="site-header">
      <div className="shell header-inner">
        <a className="wordmark" href="#hero" aria-label="Carlos Plasencia">
          <span className="brand-symbol" aria-hidden="true">c<span>p</span>
          </span>
          <span>Carlos Plasencia<span className="wordmark-dot">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label={isSpanish ? "Navegación principal" : "Main navigation"}>
          {nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
        <div className="header-actions">
          <button className="language-switch" type="button" onClick={() => setLanguage(isSpanish ? "en" : "es")} aria-label={isSpanish ? "Switch to English" : "Cambiar a español"}>
            <span className={isSpanish ? "is-selected" : ""}>ES</span>
            <span aria-hidden="true">/</span>
            <span className={!isSpanish ? "is-selected" : ""}>EN</span>
          </button>
          <a className="nav-contact" href="#contact">{copy.nav.contact}<ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? copy.nav.close : copy.nav.menu} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile-nav" aria-label={isSpanish ? "Navegación móvil" : "Mobile navigation"} hidden={!menuOpen}>{[...nav, ["contact", copy.nav.contact]].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={18} aria-hidden="true" />
      </a>)}</nav>
    </header>
    <main id="main">
      <section id="hero" className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />{copy.hero.eyebrow}</p>
          <h1 id="hero-title">{copy.hero.title}<br />
            <span>{copy.hero.accent}</span>
          </h1>
          <p className="hero-description">{copy.hero.description}</p>
          <div className="hero-actions">
            <a href="#contact" className="button button-dark">{copy.hero.primary}<ArrowUpRight size={19} aria-hidden="true" />
            </a>
            <a href="#projects" className="text-link">{copy.hero.secondary}<ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-availability">
            <span className="status-dot" />{copy.hero.availability}</div>
        </div>
        <div className="portrait-composition">
          <div className="portrait-caption-top">
            <span>{copy.hero.location}</span>
            <span aria-hidden="true">PE ↗</span>
          </div>
          <div className="portrait-frame">
            <img src="/images/carlos-plasencia.png" alt="Carlos Eduardo Plasencia Prado" width="1254" height="1254" decoding="async" />
            <div className="portrait-name">
              <span>Carlos Plasencia</span>
              <span>{copy.hero.role}</span>
            </div>
          </div>
          <div className="portrait-note">
            <Code2 size={17} aria-hidden="true" />
            <span>TypeScript · React · Node.js</span>
            <span className="portrait-index" aria-hidden="true">01 / CP</span>
          </div>
        </div>
      </section>
      <div className="stack-strip shell" aria-label={isSpanish ? "Tecnologías principales" : "Core technologies"}>
        <span>TypeScript</span>
        <span aria-hidden="true">✳</span>
        <span>React & Next.js</span>
        <span aria-hidden="true">✳</span>
        <span>Node.js & NestJS</span>
        <span aria-hidden="true">✳</span>
        <span>{isSpanish ? "IA aplicada" : "Applied AI"}</span>
        <span aria-hidden="true">✳</span>
        <span>SaaS</span>
      </div>
      <section id="projects" className="section shell" aria-labelledby="projects-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 — {copy.projects.eyebrow}</p>
            <h2 id="projects-title">{copy.projects.title}</h2>
          </div>
          <p className="section-intro">{copy.projects.intro}</p>
        </div>
        <div className="project-grid">
          {copy.projects.featured.map((project, index) => <article className={`project project-${project.id}`} key={project.id}>
            <div className={`project-art art-${project.id}`} aria-hidden="true">
              <span className="art-category">{project.category}</span>
              <span className="art-wordmark">{project.title}<span className="art-period">.</span>
              </span>
              <span className="art-index">{String(index + 1).padStart(2, "0")} / CP</span>
              <span className="art-arrow">↗</span>
            </div>
            <div className="project-body">
              <div className="project-title-row">
                <h3>{project.title}</h3>
                <a className="icon-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${copy.projects.visit}: ${project.title}`}>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </a>
              </div>
              <p className="project-summary">{project.summary}</p>
              <p className="project-role">
                <span>{copy.projects.labelRole}</span>{project.contribution}</p>
              <div className="tech-list">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>
              <details className="project-details">
                <summary>{copy.projects.labelDetails}<ChevronDown size={16} aria-hidden="true" />
                </summary>
                <ul>{project.details.map(detail => <li key={detail}>
                  <Check size={14} aria-hidden="true" />
                  <span>{detail}</span>
                </li>)}</ul>{project.caseStudy ? <a className="text-link" href={project.caseStudy} target="_blank" rel="noopener noreferrer">{isSpanish ? "Ver caso en PDF" : "Read the PDF case study"}<ArrowUpRight size={15} aria-hidden="true" />
                </a> : null}</details>
            </div>
          </article>)}</div>
      </section>
      <section id="services" className="services-section" aria-labelledby="services-title">
        <div className="shell section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 — {copy.services.eyebrow}</p>
              <h2 id="services-title">{copy.services.title}</h2>
            </div>
            <p className="section-intro">{copy.services.intro}</p>
          </div>
          <div className="services-list">{copy.services.offerings.map((service, index) => <article className="service-row" key={service.title}>
            <span className="service-number">0{index + 1}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <ArrowUpRight size={25} aria-hidden="true" />
          </article>)}</div>
        </div>
      </section>
      <section id="about" className="section shell about-section" aria-labelledby="about-title">
        <div className="about-title">
          <p className="eyebrow">03 — {copy.about.eyebrow}</p>
          <h2 id="about-title">{copy.about.title}</h2>
          <a className="text-link" href={CONTACT_CHANNELS.studio} target="_blank" rel="noopener noreferrer">Totora Studio<ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="about-body">{copy.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<h3 className="stack-title">{copy.about.skillsTitle}</h3>
          <div className="skills-list">{copy.about.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
          <a className="text-link cv-link" href={copy.cv.url} download>{copy.cv.label}<Download size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="process-section shell" aria-labelledby="process-title">
        <p className="eyebrow">{copy.process.eyebrow}</p>
        <h2 id="process-title">{copy.process.title}</h2>
        <div className="process-grid">{copy.process.steps.map((step, index) => <article key={step.title}>
          <span className="process-number">0{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>)}</div>
      </section>
      <section id="experience" className="section shell experience-section" aria-labelledby="experience-title">
        <div className="experience-title">
          <p className="eyebrow">04 — {copy.experience.eyebrow}</p>
          <h2 id="experience-title">{copy.experience.title}</h2>
          <a className="text-link" href={CONTACT_CHANNELS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="experience-list">{copy.experience.jobs.map(job => <article key={job.company} className="experience-job">
          <div className="job-heading">
            <h3>{job.company}</h3>
            <span>{job.period}</span>
          </div>
          <p className="job-position">{job.position}</p>
          <p className="job-description">{job.description}</p>
        </article>)}</div>
      </section>
      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="shell contact-inner">
          <div>
            <p className="eyebrow">
              <span className="status-dot" />{copy.contact.eyebrow}</p>
            <h2 id="contact-title">{copy.contact.title}</h2>
            <p className="contact-description">{copy.contact.description}</p>
            <div className="contact-buttons">
              <a className="button button-light" href={`mailto:${CONTACT_CHANNELS.email}`}>{copy.contact.emailLabel}<Mail size={18} aria-hidden="true" />
              </a>
              <a className="button button-outline" href={`${CONTACT_CHANNELS.whatsapp}?text=${encodeURIComponent(copy.contact.whatsappMessage)}`} target="_blank" rel="noopener noreferrer">{copy.contact.whatsappLabel}<ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <a className="contact-email" href={`mailto:${CONTACT_CHANNELS.email}`}>{CONTACT_CHANNELS.email}<ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <aside className="employment-note">
            <span className="small-cross" aria-hidden="true">✳</span>
            <p>{copy.contact.employment}</p>
            <a href={copy.cv.url} className="text-link" download>{copy.cv.label}<Download size={16} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>
    </main>
    <footer className="site-footer shell">
      <a href="#hero" className="footer-name">© {new Date().getFullYear()} Carlos Plasencia</a>
      <span className="footer-built">{copy.footer.built}</span>
      <div className="footer-socials">
        <a href={CONTACT_CHANNELS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Github size={19} />
        </a>
        <a href={CONTACT_CHANNELS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <Linkedin size={19} />
        </a>
        <a href="#hero" className="back-top">{copy.footer.backTop}<ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </footer>
  </>;
}
export default function App() {
  return <LanguageProvider>
    <Portfolio />
  </LanguageProvider>;
}
