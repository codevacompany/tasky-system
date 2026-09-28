export type FeatureTipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface FeatureTipDefinition {
  /** Immutable contract id — never rename after shipping */
  id: string;
  title: string;
  body: string;
  placement?: FeatureTipPlacement;
  releasedAt: string;
  expiresAt?: string;
  /** If set, only these role names see the tip */
  roles?: string[];
  /** Lower number wins when multiple anchors are eligible at once */
  priority?: number;
}

export const FEATURE_TIPS: FeatureTipDefinition[] = [
  {
    id: 'drafts.ellipsis-menu',
    title: 'Tarefas em rascunho',
    body: 'Aqui você pode acessar seus rascunhos e tarefas arquivadas.',
    placement: 'bottom',
    releasedAt: '2026-09-07T00:00:00.000Z',
    expiresAt: '2026-12-07T00:00:00.000Z',
    priority: 20,
  },
  {
    id: 'drafts.save-button',
    title: 'Salvar rascunho',
    body: 'Agora você pode salvar a tarefa sem publicar. Você pode terminar e publicar depois.',
    placement: 'top',
    releasedAt: '2026-09-07T00:00:00.000Z',
    expiresAt: '2026-12-07T00:00:00.000Z',
    priority: 10,
  },
];

export const FEATURE_TIP_BY_ID = Object.fromEntries(
  FEATURE_TIPS.map((tip) => [tip.id, tip]),
) as Record<string, FeatureTipDefinition>;

export const FEATURE_TIP_ATTR = 'data-feature-tip';
