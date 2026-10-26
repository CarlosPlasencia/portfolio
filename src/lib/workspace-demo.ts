export const DEMO_STAGE = {
  IDLE: 'idle', INPUT: 'input', EXTRACT: 'extract', VALIDATE: 'validate',
  REVIEW: 'review', CONFIRMED: 'confirmed',
} as const;
export type DemoStage = (typeof DEMO_STAGE)[keyof typeof DEMO_STAGE];
export const DEMO_EVENT = {
  START: 'start', ADVANCE: 'advance', CONFIRM: 'confirm', RESET: 'reset',
} as const;
export type DemoEvent = (typeof DEMO_EVENT)[keyof typeof DEMO_EVENT];

export function nextDemoStage(stage: DemoStage, event: DemoEvent): DemoStage {
  if (event === DEMO_EVENT.RESET) return DEMO_STAGE.IDLE;
  if (event === DEMO_EVENT.START) {
    return stage === DEMO_STAGE.IDLE || stage === DEMO_STAGE.CONFIRMED ? DEMO_STAGE.INPUT : stage;
  }
  if (event === DEMO_EVENT.CONFIRM) {
    return stage === DEMO_STAGE.REVIEW ? DEMO_STAGE.CONFIRMED : stage;
  }
  if (event === DEMO_EVENT.ADVANCE) {
    const next: Partial<Record<DemoStage, DemoStage>> = {
      input: DEMO_STAGE.EXTRACT, extract: DEMO_STAGE.VALIDATE, validate: DEMO_STAGE.REVIEW,
    };
    return next[stage] ?? stage;
  }
  return stage;
}
