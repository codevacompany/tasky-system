import { RoleName } from '@/models/role';

export interface TutorialVideo {
  youtubeId: string;
  title: string;
  description: string;
}

export const TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    youtubeId: 'UBKn1SmPSYs',
    title: 'Introdução ao Tasky Pro',
    description:
      'Conheça o Tasky Pro e como configurar seu espaço de trabalho para você e sua equipe.',
  },
  {
    youtubeId: 'udSBqTZoJ5s',
    title: 'Organizando suas tarefas',
    description: 'Aprenda o básico sobre como organizar e acompanhar suas tarefas no Tasky Pro.',
  },
  {
    youtubeId: 'WZs46Yk-MM4',
    title: 'Colaboração e equipe',
    description: 'Veja como colaborar com sua equipe, atribuir tarefas e acompanhar o progresso.',
  },
  {
    youtubeId: '7cKopBkF8pk',
    title: 'Recursos avançados para administradores',
    description:
      'Configurações avançadas, relatórios e gestão de usuários e departamentos no Tasky Pro.',
  },
];

/** First video shown only to supervisors (before the shared 2nd, 3rd and 4th videos). */
const SUPERVISOR_INTRO_VIDEO: TutorialVideo = {
  youtubeId: 'NT3_rhOPlEk',
  title: 'Guia do Supervisor',
  description: 'Conteúdo exclusivo para supervisores no Tasky Pro.',
};

/**
 * Returns the list of tutorial videos for the given role.
 * - Admin (GlobalAdmin / TenantAdmin): all 4 videos
 * - Supervisor: intro video (NT3_rhOPlEk) + 2nd, 3rd and 4th videos
 * - User: 2nd and 3rd videos only
 */
export function getTutorialVideosByRole(roleName: RoleName | undefined): TutorialVideo[] {
  if (!roleName) return [TUTORIAL_VIDEOS[1], TUTORIAL_VIDEOS[2]];

  switch (roleName) {
    case RoleName.GlobalAdmin:
    case RoleName.TenantAdmin:
      return [...TUTORIAL_VIDEOS];
    case RoleName.Supervisor:
      return [
        SUPERVISOR_INTRO_VIDEO,
        TUTORIAL_VIDEOS[1],
        TUTORIAL_VIDEOS[2],
      ];
    case RoleName.User:
    default:
      return [TUTORIAL_VIDEOS[1], TUTORIAL_VIDEOS[2]];
  }
}
