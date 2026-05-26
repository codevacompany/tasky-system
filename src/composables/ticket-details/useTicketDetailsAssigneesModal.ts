import { useTicketDetailsInjected } from './useTicketDetailsInjected';

export function useTicketDetailsAssigneesModal() {
  const { ctx, access, assignees } = useTicketDetailsInjected();

  return {
    ctx,
    access,
    ...assignees,
  };
}
