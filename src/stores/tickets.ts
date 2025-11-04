import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import type { Ticket, DefaultTicketStatus, TicketPriority } from '@/models';
import type { StatusColumn } from '@/models/statusColumn';
import { statusColumnService } from '@/services/statusColumnService';
import { ticketService } from '@/services/ticketService';
import { useUserStore } from './user';

interface TicketsState {
  myTickets: {
    data: Ticket[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    lastFetched: Date | null;
    currentPage: number;
    currentFilters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    };
  };
  receivedTickets: {
    data: Ticket[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    lastFetched: Date | null;
    currentPage: number;
    currentFilters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    };
  };
  departmentTickets: {
    data: Ticket[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    lastFetched: Date | null;
    currentPage: number;
    currentFilters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    };
  };
  archivedTickets: {
    data: Ticket[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    lastFetched: Date | null;
    currentPage: number;
    currentFilters?: {
      priority?: TicketPriority | null;
      name?: string;
    };
  };
  recentReceivedTickets: Ticket[];
  recentCreatedTickets: Ticket[];
  selectedTicket: Ticket | null;
  globalRefreshInterval: number;
  isPollingActive: boolean;
  statusColumns: {
    data: StatusColumn[];
    isLoading: boolean;
    error: string | null;
    lastFetched: Date | null;
  };
}

export const useTicketsStore = defineStore('tickets', () => {
  // State
  const myTickets = ref<TicketsState['myTickets']>({
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    lastFetched: null,
    currentPage: 1,
  });

  const receivedTickets = ref<TicketsState['receivedTickets']>({
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    lastFetched: null,
    currentPage: 1,
  });

  const departmentTickets = ref<TicketsState['departmentTickets']>({
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    lastFetched: null,
    currentPage: 1,
  });

  const archivedTickets = ref<TicketsState['archivedTickets']>({
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    lastFetched: null,
    currentPage: 1,
  });

  const recentReceivedTickets = ref<Ticket[]>([]);
  const recentCreatedTickets = ref<Ticket[]>([]);
  const selectedTicket = ref<Ticket | null>(null);
  const globalRefreshInterval = ref<number>(90000); // 90 seconds default
  const isPollingActive = ref<boolean>(false);
  let pollingTimerId: number | null = null;

  // Status columns cache
  const statusColumns = ref<TicketsState['statusColumns']>({
    data: [],
    isLoading: false,
    error: null,
    lastFetched: null,
  });

  // Getters
  const getTicketById = computed(() => {
    return (id: string): Ticket | undefined => {
      const allTickets = [
        ...myTickets.value.data,
        ...receivedTickets.value.data,
        ...departmentTickets.value.data,
        ...archivedTickets.value.data,
      ];

      return allTickets.find((ticket) => ticket.customId === id);
    };
  });

  // Actions
  async function fetchMyTickets(
    page?: number,
    limit = 10,
    filters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    const userStore = useUserStore();
    if (!userStore.user) return;

    // Use current page if no page is provided
    const currentPage = page ?? myTickets.value.currentPage;
    // Use current filters if no filters are provided
    const currentFilters = filters ?? myTickets.value.currentFilters;

    if (!isPollingActive.value) {
      myTickets.value.isLoading = true;
    }

    myTickets.value.currentPage = currentPage;
    myTickets.value.currentFilters = currentFilters;
    myTickets.value.error = null;

    try {
      const params: Record<string, unknown> = { page: currentPage, limit };

      if (currentFilters) {
        if (currentFilters.status !== undefined && currentFilters.status !== null) {
          params.status = currentFilters.status;
        }
        if (currentFilters.priority !== undefined && currentFilters.priority !== null) {
          params.priority = currentFilters.priority;
        }
        if (currentFilters.name) {
          params.name = currentFilters.name;
        }
      }

      const response = await ticketService.getByRequester(userStore.user.id, params);
      myTickets.value.data = response.data.items;
      myTickets.value.totalCount = response.data.total;
      myTickets.value.lastFetched = new Date();

      if (currentPage === 1) {
        recentCreatedTickets.value = response.data.items.slice(0, 5);
      }
    } catch (error) {
      myTickets.value.error = 'Failed to fetch your tickets';
      console.error('Error fetching my tickets:', error);
    } finally {
      myTickets.value.isLoading = false;
    }
  }

  async function fetchReceivedTickets(
    page?: number,
    limit = 10,
    filters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    const userStore = useUserStore();
    if (!userStore.user) return;

    // Use current page if no page is provided
    const currentPage = page ?? receivedTickets.value.currentPage;
    // Use current filters if no filters are provided
    const currentFilters = filters ?? receivedTickets.value.currentFilters;

    if (!isPollingActive.value) {
      receivedTickets.value.isLoading = true;
    }

    receivedTickets.value.currentPage = currentPage;
    receivedTickets.value.currentFilters = currentFilters;
    receivedTickets.value.error = null;

    try {
      const params: Record<string, unknown> = { page: currentPage, limit };

      if (currentFilters) {
        if (currentFilters.status !== undefined && currentFilters.status !== null) {
          params.status = currentFilters.status;
        }
        if (currentFilters.priority !== undefined && currentFilters.priority !== null) {
          params.priority = currentFilters.priority;
        }
        if (currentFilters.name) {
          params.name = currentFilters.name;
        }
      }

      const response = await ticketService.getReceivedTickets(userStore.user.id, params);
      receivedTickets.value.data = response.data.items;
      receivedTickets.value.totalCount = response.data.total;
      receivedTickets.value.lastFetched = new Date();

      if (currentPage === 1) {
        recentReceivedTickets.value = response.data.items.slice(0, 5);
      }
    } catch (error) {
      receivedTickets.value.error = 'Failed to fetch received tickets';
      console.error('Error fetching received tickets:', error);
    } finally {
      receivedTickets.value.isLoading = false;
    }
  }

  async function fetchDepartmentTickets(
    page?: number,
    limit = 10,
    filters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    const userStore = useUserStore();
    if (!userStore.user?.departmentId) return;

    // Use current page if no page is provided
    const currentPage = page ?? departmentTickets.value.currentPage;
    // Use current filters if no filters are provided
    const currentFilters = filters ?? departmentTickets.value.currentFilters;

    if (!isPollingActive.value) {
      departmentTickets.value.isLoading = true;
    }

    departmentTickets.value.currentPage = currentPage;
    departmentTickets.value.currentFilters = currentFilters;
    departmentTickets.value.error = null;

    try {
      const params: Record<string, unknown> = { page: currentPage, limit };

      if (currentFilters) {
        if (currentFilters.status !== undefined && currentFilters.status !== null) {
          params.status = currentFilters.status;
        }
        if (currentFilters.priority !== undefined && currentFilters.priority !== null) {
          params.priority = currentFilters.priority;
        }
        if (currentFilters.name) {
          params.name = currentFilters.name;
        }
      }

      const response = await ticketService.getByDepartment(userStore.user.departmentId, params);
      departmentTickets.value.data = response.data.items;
      departmentTickets.value.totalCount = response.data.total;
      departmentTickets.value.lastFetched = new Date();
    } catch (error) {
      departmentTickets.value.error = 'Failed to fetch department tickets';
      console.error('Error fetching department tickets:', error);
    } finally {
      departmentTickets.value.isLoading = false;
    }
  }

  async function fetchArchivedTickets(
    page?: number,
    limit = 10,
    filters?: {
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    // Use current page if no page is provided
    const currentPage = page ?? archivedTickets.value.currentPage;
    // Use current filters if no filters are provided
    const currentFilters = filters ?? archivedTickets.value.currentFilters;

    if (!isPollingActive.value) {
      archivedTickets.value.isLoading = true;
    }

    archivedTickets.value.currentPage = currentPage;
    archivedTickets.value.currentFilters = currentFilters;
    archivedTickets.value.error = null;

    try {
      const params: Record<string, unknown> = { page: currentPage, limit };

      if (currentFilters) {
        if (currentFilters.priority !== undefined && currentFilters.priority !== null) {
          params.priority = currentFilters.priority;
        }
        if (currentFilters.name) {
          params.name = currentFilters.name;
        }
      }

      const response = await ticketService.getArchived(params);
      archivedTickets.value.data = response.data.items;
      archivedTickets.value.totalCount = response.data.total;
      archivedTickets.value.lastFetched = new Date();
    } catch (error) {
      archivedTickets.value.error = 'Failed to fetch archived tickets';
      console.error('Error fetching archived tickets:', error);
    } finally {
      archivedTickets.value.isLoading = false;
    }
  }

  async function fetchTicketDetails(ticketId: string) {
    try {
      const response = await ticketService.getById(ticketId);
      selectedTicket.value = response.data;

      updateTicketInCollections(response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw error;
    }
  }

  function updateTicketInCollections(updatedTicket: Ticket) {
    const updateInCollection = (collection: Ticket[]) => {
      const index = collection.findIndex((t) => t.customId === updatedTicket.customId);
      if (index !== -1) {
        collection[index] = updatedTicket;
      }
    };

    updateInCollection(myTickets.value.data);
    updateInCollection(receivedTickets.value.data);
    updateInCollection(departmentTickets.value.data);
    updateInCollection(archivedTickets.value.data);
  }

  function removeTicketFromCollections(ticketId: string) {
    const removeFromCollection = (collection: Ref<{ data: Ticket[] }>) => {
      collection.value.data = collection.value.data.filter((t) => t.customId !== ticketId);
    };

    removeFromCollection(myTickets);
    removeFromCollection(receivedTickets);
    removeFromCollection(departmentTickets);
    removeFromCollection(archivedTickets);
  }

  async function refreshAllTickets() {
    const userStore = useUserStore();
    if (!userStore.user) return;

    await Promise.all([
      fetchMyTickets(),
      fetchReceivedTickets(),
      fetchDepartmentTickets(),
      fetchArchivedTickets(),
    ]);
  }

  async function fetchStatusColumns(force = false) {
    if (!force && statusColumns.value.data.length > 0) return;
    statusColumns.value.isLoading = true;
    statusColumns.value.error = null;
    try {
      const { data } = await statusColumnService.fetch({ limit: 100 });
      statusColumns.value.data = data.items;
      statusColumns.value.lastFetched = new Date();
    } catch (err) {
      console.error('Error fetching status columns:', err);
      statusColumns.value.error = 'Failed to fetch status columns';
    } finally {
      statusColumns.value.isLoading = false;
    }
  }

  async function startPolling() {
    if (isPollingActive.value) return;

    await refreshAllTickets();

    isPollingActive.value = true;

    pollingTimerId = window.setInterval(() => {
      refreshAllTickets();
    }, globalRefreshInterval.value);
  }

  function stopPolling() {
    if (pollingTimerId) {
      clearInterval(pollingTimerId);
      pollingTimerId = null;
    }
    isPollingActive.value = false;
  }

  function setRefreshInterval(intervalMs: number) {
    globalRefreshInterval.value = intervalMs;
    if (isPollingActive.value) {
      stopPolling();
      startPolling();
    }
  }

  function $dispose() {
    stopPolling();
  }

  function setMyTicketsPage(
    page: number,
    filters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    myTickets.value.currentPage = page;
    return fetchMyTickets(page, 10, filters);
  }

  function setReceivedTicketsPage(
    page: number,
    filters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    receivedTickets.value.currentPage = page;
    return fetchReceivedTickets(page, 10, filters);
  }

  function setDepartmentTicketsPage(
    page: number,
    filters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    departmentTickets.value.currentPage = page;
    return fetchDepartmentTickets(page, 10, filters);
  }

  function setArchivedTicketsPage(
    page: number,
    filters?: {
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    archivedTickets.value.currentPage = page;
    return fetchArchivedTickets(page, 10, filters);
  }

  function setCurrentPage(
    type: 'createdByMe' | 'received' | 'department' | 'archived',
    page: number,
    filters?: {
      status?: DefaultTicketStatus | null;
      priority?: TicketPriority | null;
      name?: string;
    },
  ) {
    switch (type) {
      case 'createdByMe':
        return setMyTicketsPage(page, filters);
      case 'received':
        return setReceivedTicketsPage(page, filters);
      case 'department':
        return setDepartmentTicketsPage(page, filters);
      case 'archived':
        return setArchivedTicketsPage(page, filters);
    }
  }

  return {
    // State
    myTickets,
    receivedTickets,
    departmentTickets,
    archivedTickets,
    selectedTicket,
    globalRefreshInterval,
    isPollingActive,
    statusColumns,

    // Recent tickets
    recentReceivedTickets,
    recentCreatedTickets,

    // Getters
    getTicketById,

    // Actions
    fetchMyTickets,
    fetchReceivedTickets,
    fetchDepartmentTickets,
    fetchArchivedTickets,
    fetchTicketDetails,
    refreshAllTickets,
    updateTicketInCollections,
    removeTicketFromCollections,
    fetchStatusColumns,
    startPolling,
    stopPolling,
    setRefreshInterval,
    $dispose,

    // Pagination control
    setCurrentPage,
    setMyTicketsPage,
    setReceivedTicketsPage,
    setDepartmentTicketsPage,
    setArchivedTicketsPage,
  };
});
