import { AudioLines, ArrowUpRight, BookOpen, CalendarDays, Check, Play } from 'lucide-react';

interface VisualProps { id: string; title: string; es: boolean; }
export default function ProjectVisual({ id, title, es }: VisualProps) {
  return <figure className={`ws-project-visual visual-${id}`} aria-label={`${title} · ${es ? 'Ilustración conceptual, no captura del producto' : 'Concept illustration, not a product screenshot'}`}>
    <div className="ws-visual-top"><span>{title.toUpperCase()}</span><span>CONCEPT / 0{['financialia', 'dgf', 'maki', 'skillramp', 'reservaya'].indexOf(id) + 1}</span></div>
    {id === 'financialia' ? <div className="ws-finance-art"><div className="ws-voice-orbit"><AudioLines size={40} /></div><div className="ws-art-receipt"><span>TRANSACTION / REVIEW</span><strong>S/ 12.00</strong><div><span>{es ? 'Café' : 'Coffee'}</span><span>Yape <Check size={11} /></span></div><div className="ws-art-wave">{[16, 29, 20, 43, 32, 54, 38, 23, 42, 18, 27, 13].map((height, index) => <i style={{ height }} key={index} />)}</div></div></div>
      : id === 'dgf' ? <div className="ws-property-art"><div className="ws-tower tower-back" /><div className="ws-tower tower-front" /><div className="ws-property-label"><span>CONTENT → WEBSITE</span><strong>{es ? 'Espacios que conectan.' : 'Spaces that connect.'}</strong><ArrowUpRight size={23} /></div></div>
      : id === 'maki' ? <div className="ws-maki-art"><div className="ws-chopsticks" /><div className="ws-sushi-plate">{[0, 1, 2, 3].map(i => <div className="ws-sushi" key={i}><i /></div>)}</div><div className="ws-menu-ticket"><span>MAKI PANDA / MENU</span><strong>{es ? 'Buen sabor. Mejor experiencia.' : 'Great taste. Better experience.'}</strong><span>MENU → ORDER → LOYALTY</span></div></div>
      : id === 'skillramp' ? <div className="ws-academy-art"><div className="ws-academy-window"><span><BookOpen size={13} /> academy / workspace</span><div className="ws-video-art"><Play size={33} fill="currentColor" /></div><div className="ws-course-lines"><i /><i /><i /></div></div><div className="ws-academy-tag"><Check size={13} /> CREATOR ↔ STUDENT</div></div>
      : <div className="ws-calendar-art"><div className="ws-calendar-sheet"><CalendarDays size={23} /><span>AVAILABILITY</span><div className="ws-calendar-grid">{Array.from({ length: 21 }, (_, i) => <span key={i} className={i === 10 ? 'chosen' : ''}>{i + 1}</span>)}</div></div><div className="ws-time-ticket">10:30 <Check size={17} /></div></div>}
    <figcaption>{es ? 'Ilustración del flujo del producto' : 'Product workflow illustration'}</figcaption>
  </figure>;
}
