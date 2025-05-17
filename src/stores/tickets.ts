import { defineStore } from 'pinia';
import { ref, computed, type Ref } from 'vue';
import type { Ticket } from '@/models';
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
  };
  receivedTickets: {
    data: Ticket[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    lastFetched: Date | null;
    currentPage: number;
  };
  departmentTickets: {
    data: Ticket[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    lastFetched: Date | null;
    currentPage: number;
  };
  archivedTickets: {
    data: Ticket[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    lastFetched: Date | null;
    currentPage: number;
  };
  recentReceivedTickets: Ticket[];
  recentCreatedTickets: Ticket[];
  selectedTicket: Ticket | null;
  globalRefreshInterval: number;
  isPollingActive: boolean;
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
  const globalRefreshInterval = ref<number>(90000); // 1 minute default
  const isPollingActive = ref<boolean>(false);
  let pollingTimerId: number | null = null;

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
  async function fetchMyTickets(page = 1, limit = 10) {
    const userStore = useUserStore();
    if (!userStore.user) return;

    if (!isPollingActive.value) {
      myTickets.value.isLoading = true;
    }

    myTickets.value.currentPage = page;
    myTickets.value.error = null;

    try {
      const response = await ticketService.getByRequester(userStore.user.id, { page, limit });
      myTickets.value.data = response.data.items;
      myTickets.value.totalCount = response.data.total;
      myTickets.value.lastFetched = new Date();

      if (page === 1) {
        recentCreatedTickets.value = response.data.items.slice(0, 5);
      }
    } catch (error) {
      myTickets.value.error = 'Failed to fetch your tickets';
      console.error('Error fetching my tickets:', error);
    } finally {
      myTickets.value.isLoading = false;
    }
  }

  async function fetchReceivedTickets(page = 1, limit = 10) {
    const userStore = useUserStore();
    if (!userStore.user) return;

    if (!isPollingActive.value) {
      receivedTickets.value.isLoading = true;
    }

    receivedTickets.value.currentPage = page;
    receivedTickets.value.error = null;

    try {
      const response = await ticketService.getByTargetUser(userStore.user.id, { page, limit });
      receivedTickets.value.data = response.data.items;
      receivedTickets.value.totalCount = response.data.total;
      receivedTickets.value.lastFetched = new Date();

      if (page === 1) {
        recentReceivedTickets.value = response.data.items.slice(0, 5);
      }
    } catch (error) {
      receivedTickets.value.error = 'Failed to fetch received tickets';
      console.error('Error fetching received tickets:', error);
    } finally {
      receivedTickets.value.isLoading = false;
    }
  }

  async function fetchDepartmentTickets(page = 1, limit = 10) {
    const userStore = useUserStore();
    if (!userStore.user?.departmentId) return;

    if (!isPollingActive.value) {
      departmentTickets.value.isLoading = true;
    }

    departmentTickets.value.currentPage = page;
    departmentTickets.value.error = null;

    try {
      const response = await ticketService.getByDepartment(userStore.user.departmentId, {
        page,
        limit,
      });
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

  async function fetchArchivedTickets(page = 1, limit = 10) {
    if (!isPollingActive.value) {
      archivedTickets.value.isLoading = true;
    }

    archivedTickets.value.currentPage = page;
    archivedTickets.value.error = null;

    try {
      const response = await ticketService.getArchived({ page, limit });
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

    await fetchMyTickets(myTickets.value.currentPage);
    await fetchReceivedTickets(receivedTickets.value.currentPage);
    await fetchDepartmentTickets(departmentTickets.value.currentPage);
    await fetchArchivedTickets(archivedTickets.value.currentPage);
  }

  function startPolling() {
    if (isPollingActive.value) return;

    refreshAllTickets();

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

  async function fetchTickets(
    type: 'createdByMe' | 'received' | 'department' | 'archived' = 'createdByMe',
    page = 1,
    limit = 10,
  ) {
    switch (type) {
      case 'createdByMe':
        await fetchMyTickets(page, limit);
        break;
      case 'received':
        await fetchReceivedTickets(page, limit);
        break;
      case 'department':
        await fetchDepartmentTickets(page, limit);
        break;
      case 'archived':
        await fetchArchivedTickets(page, limit);
        break;
    }
  }

  function setMyTicketsPage(page: number) {
    myTickets.value.currentPage = page;
    return fetchMyTickets(page);
  }

  function setReceivedTicketsPage(page: number) {
    receivedTickets.value.currentPage = page;
    return fetchReceivedTickets(page);
  }

  function setDepartmentTicketsPage(page: number) {
    departmentTickets.value.currentPage = page;
    return fetchDepartmentTickets(page);
  }

  function setArchivedTicketsPage(page: number) {
    archivedTickets.value.currentPage = page;
    return fetchArchivedTickets(page);
  }

  function setCurrentPage(
    type: 'createdByMe' | 'received' | 'department' | 'archived',
    page: number,
  ) {
    switch (type) {
      case 'createdByMe':
        return setMyTicketsPage(page);
      case 'received':
        return setReceivedTicketsPage(page);
      case 'department':
        return setDepartmentTicketsPage(page);
      case 'archived':
        return setArchivedTicketsPage(page);
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
    startPolling,
    stopPolling,
    setRefreshInterval,
    fetchTickets,
    $dispose,

    // Pagination control
    setCurrentPage,
    setMyTicketsPage,
    setReceivedTicketsPage,
    setDepartmentTicketsPage,
    setArchivedTicketsPage,
  };
});
