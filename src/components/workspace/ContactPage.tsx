import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { CONTACT_CHANNELS } from '../../lib/i18n';
import { copyContactEmail } from '../../lib/workspace-content';

const COPY_STATUS = { IDLE: 'idle', COPIED: 'copied', MANUAL: 'manual' } as const;
type CopyStatus = (typeof COPY_STATUS)[keyof typeof COPY_STATUS];
interface ContactProps { es: boolean; message: string; cvUrl: string; }

export default function ContactPage({ es, message, cvUrl }: ContactProps) {
  const [status, setStatus] = useState<CopyStatus>(COPY_STATUS.IDLE);
  async function copyEmail() {
    const writer = navigator.clipboard?.writeText.bind(navigator.clipboard);
    const copied = await copyContactEmail(CONTACT_CHANNELS.email, writer);
    setStatus(copied ? COPY_STATUS.COPIED : COPY_STATUS.MANUAL);
  }
  const links = [
    { title: 'WhatsApp', detail: CONTACT_CHANNELS.phone, description: es ? 'Conversemos sobre tu proyecto.' : 'Let’s talk about your project.', href: `${CONTACT_CHANNELS.whatsapp}?text=${encodeURIComponent(message)}`, Icon: MessageCircle },
    { title: 'LinkedIn', detail: 'Carlos Plasencia', description: es ? 'Mi trayectoria profesional y un espacio para conectar.' : 'My professional background and a place to connect.', href: CONTACT_CHANNELS.linkedin, Icon: Linkedin },
    { title: 'GitHub', detail: 'CarlosPlasencia', description: es ? 'Código y proyectos públicos.' : 'Code and public projects.', href: CONTACT_CHANNELS.github, Icon: Github },
    { title: 'Totora Studio', detail: 'totora.studio', description: es ? 'Mi estudio independiente de desarrollo.' : 'My independent development studio.', href: CONTACT_CHANNELS.studio, Icon: ArrowUpRight },
  ];
  return <section className="ws-document ws-contact" aria-labelledby="ws-main-title">
    <span className="ws-comment">// contact.ts / {es ? 'elige tu canal' : 'choose your channel'}</span>
    <h1 id="ws-main-title">{es ? 'Hablemos de tu proyecto.' : 'Let’s talk about your project.'}</h1>
    <p className="ws-doc-lead">{es ? 'Cuéntame qué quieres construir y en qué punto estás. Elige la opción que te resulte más cómoda.' : 'Tell me what you want to build and where you are in the process. Choose the option that works best for you.'}</p>
    <div className="ws-contact-email">
      <div className="ws-contact-icon"><Mail size={23} /></div>
      <div className="ws-contact-email-content"><h2>{es ? 'Correo electrónico' : 'Email'}</h2><label htmlFor="contact-email">{es ? 'Mi dirección de correo' : 'My email address'}</label><input id="contact-email" type="text" readOnly value={CONTACT_CHANNELS.email} spellCheck={false} onFocus={event => event.currentTarget.select()} /><p>{es ? 'Cópialo y escribe desde el servicio de correo que utilices.' : 'Copy it and write from your preferred email service.'}</p></div>
      <button className="ws-demo-action" onClick={copyEmail}>{status === COPY_STATUS.COPIED ? <Check size={15} /> : <Copy size={15} />}{status === COPY_STATUS.COPIED ? (es ? 'Correo copiado' : 'Email copied') : (es ? 'Copiar correo' : 'Copy email')}</button>
      <p className="ws-copy-feedback" role="status" aria-live="polite">{status === COPY_STATUS.COPIED ? (es ? 'Dirección copiada al portapapeles.' : 'Address copied to the clipboard.') : status === COPY_STATUS.MANUAL ? (es ? 'No se pudo copiar automáticamente. Selecciona la dirección de arriba y cópiala manualmente.' : 'Automatic copy was unavailable. Select the address above and copy it manually.') : ''}</p>
    </div>
    <div className="ws-contact-options">{links.map(({ title, detail, description, href, Icon }) => <a key={title} href={href} target="_blank" rel="noopener noreferrer"><span className="ws-contact-icon"><Icon size={23} /></span><div><h2>{title}</h2><span>{detail}</span><p>{description}</p></div><ArrowUpRight size={19} /></a>)}</div>
    <div className="ws-contact-note"><span>{es ? 'Trujillo, Perú · Disponible para trabajo remoto' : 'Trujillo, Peru · Available for remote work'}</span><a className="ws-secondary" href={cvUrl} target="_blank" rel="noopener noreferrer" aria-label={es ? 'Abrir CV en nueva pestaña' : 'Open CV in a new tab'}>{es ? 'Ver CV' : 'View CV'}<ArrowUpRight size={15} /></a></div>
  </section>;
}
