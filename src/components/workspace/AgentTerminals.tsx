import { Check, Terminal } from 'lucide-react';

export default function AgentTerminals({ es }: { es: boolean }) {
  const sessions = [
    { name: 'codex', path: '~/workspace/product', command: es ? 'Revisar arquitectura y proponer un cambio acotado' : 'Review architecture and propose a scoped change', lines: es ? ['Inspeccionar contexto del proyecto', 'Preparar cambio y pruebas', 'Esperar revisión humana'] : ['Inspect project context', 'Prepare change and tests', 'Wait for human review'] },
    { name: 'claude', path: '~/workspace/review', command: es ? 'Revisar el flujo y señalar casos límite' : 'Review the flow and identify edge cases', lines: es ? ['Leer el alcance acordado', 'Revisar validación y errores', 'Decisión final: Carlos'] : ['Read the agreed scope', 'Review validation and errors', 'Final decision: Carlos'] },
  ];
  return <section className="ws-agent-area" aria-labelledby="agents-heading">
    <div className="ws-agent-caption"><div><span className="ws-section-caption">HUMAN-LED / AGENT-ASSISTED</span><h2 id="agents-heading">{es ? 'Yo dirijo. Las herramientas amplían.' : 'I lead. The tools amplify.'}</h2></div><span>{es ? 'Secuencia ilustrativa · sin agentes reales' : 'Illustrative sequence · no live agents'}</span></div>
    <div className="ws-agent-terminals">{sessions.map(session => <div className="ws-agent-terminal" key={session.name}>
      <div className="ws-agent-bar"><Terminal size={13} /><span>{session.name}</span><span>{session.path}</span></div>
      <p className="ws-agent-prompt"><span>❯</span> {session.command}</p>
      <div className="ws-agent-lines">{session.lines.map((line, index) => <p key={line} style={{ animationDelay: `${index * .55 + .2}s` }}><Check size={12} />{line}</p>)}</div>
      <div className="ws-agent-review"><span />{es ? 'Validación y criterio humano' : 'Human validation and judgment'}</div>
    </div>)}</div>
  </section>;
}
