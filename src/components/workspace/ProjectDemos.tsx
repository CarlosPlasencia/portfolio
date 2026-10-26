import { useEffect, useReducer } from 'react';
import { Terminal, Play, X, Check, AudioLines, Zap, Code2, ArrowRight, RotateCcw } from 'lucide-react';
import { DEMO_EVENT, DEMO_STAGE, nextDemoStage } from '../../lib/workspace-demo';
import { INITIAL_LOCAL_DEMO, LOCAL_ACTION, updateLocalDemo } from '../../lib/workspace-content';
const FLOW = [DEMO_STAGE.INPUT, DEMO_STAGE.EXTRACT, DEMO_STAGE.VALIDATE, DEMO_STAGE.REVIEW];
interface DemoProps { es: boolean; motion: boolean; }
function FinancialiaDemo({ es, motion }: DemoProps) {
  const [stage, dispatch] = useReducer(nextDemoStage, DEMO_STAGE.IDLE);
  const step = FLOW.findIndex(item => item === stage);
  const complete = stage === DEMO_STAGE.CONFIRMED;
  const running = step >= 0 && step < 3;
  const labels = es ? ['Entrada', 'Extracción', 'Validación', 'Tu revisión'] : ['Input', 'Extraction', 'Validation', 'Your review'];
  const stageLabel = complete ? (es ? 'Confirmado · solo demo' : 'Confirmed · demo only')
    : stage === DEMO_STAGE.IDLE ? (es ? 'Esperando ejecución' : 'Ready to run') : labels[step];
  useEffect(() => {
    if (!running || !motion) return;
    const timer = window.setTimeout(() => dispatch(DEMO_EVENT.ADVANCE), 1300);
    return () => window.clearTimeout(timer);
  }, [stage, running, motion]);
  return (<section className="ws-trace" aria-labelledby="trace-title">
            <div className="ws-trace-title">
              <div>
                <Terminal size={15} />
                <h2 id="trace-title">financialia.pipeline</h2>
                <span className="ws-trace-badge">{es ? 'DEMO INTERACTIVA' : 'INTERACTIVE DEMO'}</span>
              </div>
              <div className="ws-trace-actions">
                <span className="ws-demo-label">{es ? 'Datos ficticios · sin llamadas a IA' : 'Sample data · no AI calls'}</span>{stage === DEMO_STAGE.IDLE || complete ? <button className="ws-run" onClick={() => dispatch(DEMO_EVENT.START)}>
                  <Play size={12} />{complete ? (es ? 'Repetir' : 'Replay') : (es ? 'Ejecutar' : 'Run')}</button> : <button className="ws-reset" onClick={() => dispatch(DEMO_EVENT.RESET)}>
                  <X size={12} />{es ? 'Reiniciar' : 'Reset'}</button>}</div>
            </div>
            <div className="ws-trace-body">
              <div className="ws-flow">{FLOW.map((item, index) => <div className={`ws-flow-step ${step === index ? 'is-current' : ''} ${step > index || complete ? 'is-done' : ''}`} key={item}>
                <span className="ws-flow-node">{step > index || complete ? <Check size={13} /> : index === 0 ? <AudioLines size={14} /> : index === 1 ? <Zap size={13} /> : index === 2 ? <Code2 size={14} /> : <Check size={13} />}</span>
                <span>{labels[index]}</span>{index < 3 ? <span className="ws-flow-wire">
                  <i />
                </span> : null}</div>)}</div>
              <div className="ws-terminal-output" aria-live="polite" aria-atomic="true">
                <span className="ws-output-prompt">❯</span>
                <div>
                  <span className="ws-output-status">{stageLabel}</span>
                  <p>{stage === DEMO_STAGE.IDLE ? (es ? 'De una frase a una transacción. Pulsa Ejecutar para seguir el recorrido.' : 'From a sentence to a transaction. Press Run to follow the flow.') : stage === DEMO_STAGE.INPUT ? (es ? '“Compré un café por 12 soles y pagué con Yape.”' : '“I bought coffee for 12 soles and paid with Yape.”') : stage === DEMO_STAGE.EXTRACT ? '{ "type": "expense", "amount": 12, "currency": "PEN", "account": "Yape" }' : stage === DEMO_STAGE.VALIDATE ? (es ? 'Monto válido. Moneda reconocida. Pendiente de tu confirmación.' : 'Valid amount. Recognized currency. Waiting for your confirmation.') : complete ? (es ? 'Confirmación simulada. No se ha guardado ninguna transacción.' : 'Simulated confirmation. No transaction has been saved.') : (es ? 'Café · S/12.00 PEN · Yape. Tú decides antes de registrar.' : 'Coffee · S/12.00 PEN · Yape. You decide before saving.')}</p>
                </div>{stage === DEMO_STAGE.REVIEW ? <button className="ws-confirm" onClick={() => dispatch(DEMO_EVENT.CONFIRM)}>{es ? 'Confirmar demo' : 'Confirm demo'}<Check size={13} />
                </button> : running && !motion ? <button className="ws-confirm" onClick={() => dispatch(DEMO_EVENT.ADVANCE)}>{es ? 'Siguiente paso' : 'Next step'}<ArrowRight size={13} />
                </button> : <span className={`ws-terminal-caret ${running ? 'is-live' : ''}`} />}</div>
            </div>
          </section>);
}

export default function ProjectDemos({ id, es, motion }: DemoProps & { id: string }) {
  const [state, dispatch] = useReducer(updateLocalDemo, INITIAL_LOCAL_DEMO);
  if (id === 'financialia') return <FinancialiaDemo es={es} motion={motion} />;
  const titles: Record<string, string> = { dgf: 'dgf.content-studio', maki: 'maki.menu-and-loyalty', skillramp: 'skillramp.learning-space', reservaya: 'reservaya.availability' };
  if (!titles[id]) return null;
  return <section className="ws-trace ws-project-demo" aria-labelledby="project-demo-title">
    <div className="ws-trace-title"><div><Terminal size={15} /><h2 id="project-demo-title">{titles[id]}</h2></div><button className="ws-demo-reset" onClick={() => dispatch({ type: LOCAL_ACTION.RESET })} aria-label={es ? 'Reiniciar demo' : 'Reset demo'}><RotateCcw size={14} /></button></div>
    <p className="ws-simulation-label">{es ? 'Simulación interactiva · datos ficticios · no modifica el producto real' : 'Interactive simulation · sample data · does not change the real product'}</p>
    {id === 'dgf' ? <div className="ws-demo-split">
      <div className="ws-demo-control"><span className="ws-section-caption">CONTENT MANAGEMENT</span><label htmlFor="demo-content">{es ? 'Nombre del proyecto' : 'Project name'}</label><input id="demo-content" maxLength={70} value={state.content} onChange={event => dispatch({ type: LOCAL_ACTION.CONTENT, value: event.target.value })} /><button className="ws-primary" onClick={() => dispatch({ type: LOCAL_ACTION.PUBLISH })}>{es ? 'Publicar vista de ejemplo' : 'Publish sample preview'}<ArrowRight size={14} /></button></div>
      <div className="ws-cms-preview"><div className="ws-building-mini" aria-hidden="true" /><span>LIVE PREVIEW</span><h3>{state.content || (es ? 'Sin título' : 'Untitled')}</h3><p aria-live="polite">{state.published ? (es ? 'Vista de ejemplo publicada. Nada se envió a DGF.' : 'Sample preview published. Nothing was sent to DGF.') : (es ? 'Edita el nombre: la vista se actualiza al instante.' : 'Edit the name: the preview updates instantly.')}</p></div>
    </div> : id === 'maki' ? <div className="ws-demo-split">
      <div className="ws-demo-control"><span className="ws-section-caption">MENU / SAMPLE ITEM</span><h3>{es ? 'Roll de ejemplo' : 'Sample roll'}</h3><p>{es ? 'Carta configurable y un recorrido de fidelización en miniatura.' : 'A configurable menu and a miniature loyalty journey.'}</p><button className="ws-primary" onClick={() => dispatch({ type: LOCAL_ACTION.ADD })}>{es ? 'Añadir a la orden' : 'Add to order'} +</button></div>
      <div className="ws-order-preview"><span>{es ? 'Orden de ejemplo' : 'Sample order'}</span><strong>{state.cart.toString().padStart(2, '0')}</strong><p aria-live="polite">{es ? 'Productos' : 'Items'} · {state.points} {es ? 'puntos de ejemplo' : 'sample points'}</p><button className="ws-demo-action" disabled={!state.cart} onClick={() => dispatch({ type: LOCAL_ACTION.CHECKOUT })}>{es ? 'Simular compra y sumar puntos' : 'Simulate purchase and earn points'}<Check size={14} /></button><small>{es ? '10 puntos ficticios por producto. No representa las reglas del restaurante.' : '10 sample points per item. Not the restaurant’s actual program rules.'}</small></div>
    </div> : id === 'skillramp' ? <div className="ws-demo-split">
      <div className="ws-demo-control"><span className="ws-section-caption">ROLE-BASED EXPERIENCE</span><button className="ws-demo-action" onClick={() => dispatch({ type: LOCAL_ACTION.ROLE })}>{es ? 'Cambiar a vista de' : 'Switch to'} {state.student ? (es ? 'creador' : 'creator') : (es ? 'estudiante' : 'student')}<ArrowRight size={14} /></button><p>{es ? 'Dos perspectivas sobre la misma lección de ejemplo.' : 'Two perspectives on the same sample lesson.'}</p></div>
      <div className="ws-lesson-preview"><span>{state.student ? 'STUDENT / LMS' : 'CREATOR / DASHBOARD'}</span><h3>{es ? 'Introducción al producto' : 'Product introduction'}</h3>{state.student ? <><div className="ws-progress"><i style={{ width: state.lessonComplete ? '100%' : '0%' }} /></div><button className="ws-demo-action" disabled={state.lessonComplete} onClick={() => dispatch({ type: LOCAL_ACTION.LESSON })}>{state.lessonComplete ? (es ? 'Lección completada' : 'Lesson completed') : (es ? 'Marcar como completada' : 'Mark as complete')}</button></> : <p>{es ? 'Lección 01 · Contenido de muestra · Disponible para el estudiante' : 'Lesson 01 · Sample content · Available to the student'}</p>}<p aria-live="polite">{state.lessonComplete ? (es ? 'Progreso local: 1 de 1 lecciones.' : 'Local progress: 1 of 1 lessons.') : (es ? 'Progreso local: 0 de 1 lecciones.' : 'Local progress: 0 of 1 lessons.')}</p></div>
    </div> : <div className="ws-demo-split">
      <div className="ws-demo-control"><span className="ws-section-caption">AVAILABILITY / SAMPLE DAY</span><h3>{es ? 'Elige una hora' : 'Pick a time'}</h3><div className="ws-slots">{['09:00', '10:30', '11:30'].map(slot => <button key={slot} aria-pressed={state.slot === slot} onClick={() => dispatch({ type: LOCAL_ACTION.SLOT, value: slot })}>{slot}</button>)}</div><p>{es ? 'Agenda ficticia. No consulta disponibilidad real.' : 'Sample calendar. No live availability is checked.'}</p></div>
      <div className="ws-booking-preview"><span>{es ? 'Tu selección' : 'Your selection'}</span><strong>{state.slot || '— : —'}</strong><button className="ws-demo-action" disabled={!state.slot || state.reserved} onClick={() => dispatch({ type: LOCAL_ACTION.RESERVE })}>{es ? 'Simular reserva' : 'Simulate booking'}<Check size={14} /></button><p aria-live="polite">{state.reserved ? (es ? 'Reserva simulada. No se creó una cita ni se realizó ningún cobro.' : 'Simulated booking. No appointment was created and no payment was made.') : (es ? 'Selecciona y confirma para ver el recorrido.' : 'Select and confirm to explore the flow.')}</p></div>
    </div>}
  </section>;
}
