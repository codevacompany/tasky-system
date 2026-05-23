import { inject } from 'vue';
import { TICKET_DETAILS_DEPS_KEY, type TicketDetailsProvided } from './ticketDetailsInjection';

export function useTicketDetailsInjected(): TicketDetailsProvided {
  const injected = inject(TICKET_DETAILS_DEPS_KEY);
  if (!injected) {
    throw new Error('useTicketDetailsInjected must be used within TicketDetailsModal');
  }
  return injected;
}
