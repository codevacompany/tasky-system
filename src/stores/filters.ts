import { defineStore } from 'pinia';

const SEARCH_DEBOUNCE_DELAY = 300;

export interface FilterParams {
  [key: string]: string | number | undefined;
}

interface FilterContext {
  filters: FilterParams;
  _searchTimeout: NodeJS.Timeout | null;
  _currentSearchValue: string;
}

interface FiltersState {
  filters: FilterParams;
  contexts: Record<string, FilterContext>;
  currentContext: string | null;
  isLoading: boolean;
  routeName: string;
  _navigating: boolean;
}

export const useFiltersStore = defineStore('filters', {
  state: (): FiltersState => ({
    filters: {},
    contexts: {},
    currentContext: null,
    isLoading: false,
    routeName: '',
    _navigating: false,
  }),

  getters: {
    currentFilters(): FilterParams {
      if (this.currentContext && this.contexts[this.currentContext]) {
        return this.contexts[this.currentContext].filters;
      }
      return this.filters;
    },

    getContextFilters: (state) => {
      return (contextKey: string): FilterParams => {
        if (state.contexts[contextKey]) {
          return state.contexts[contextKey].filters;
        }
        return {};
      };
    },

    activeFilters(): FilterParams {
      const filters = this.currentFilters;
      return Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
          return (
            key !== 'page' &&
            key !== 'sortBy' &&
            key !== 'sortOrder' &&
            value !== undefined &&
            String(value).trim() !== ''
          );
        }),
      );
    },

    hasActiveFilters(): boolean {
      return Object.keys(this.activeFilters).length > 0;
    },

    currentSortBy(): string | undefined {
      return this.currentFilters.sortBy as string | undefined;
    },

    currentSortOrder(): 'asc' | 'desc' | undefined {
      return this.currentFilters.sortOrder as 'asc' | 'desc' | undefined;
    },

    currentSortDirection(): 'asc' | 'desc' | 'none' {
      const sortBy = this.currentFilters.sortBy as string | undefined;
      const sortOrder = this.currentFilters.sortOrder as 'asc' | 'desc' | undefined;

      if (sortBy && sortOrder) {
        return sortOrder;
      }
      return 'none';
    },

    currentPage(): number {
      return (this.currentFilters.page as number) || 1;
    },

    currentSearch(): string | undefined {
      return this.currentFilters.name as string | undefined;
    },
  },

  actions: {
    setContext(contextKey: string) {
      this.currentContext = contextKey;
      if (!this.contexts[contextKey]) {
        this.contexts[contextKey] = {
          filters: {},
          _searchTimeout: null,
          _currentSearchValue: '',
        };
      }
    },

    initializeContext(
      contextKey: string,
      initialFilters: FilterParams = {},
      force = false,
      skipUrlRead = false,
    ) {
      if (!this.contexts[contextKey]) {
        this.contexts[contextKey] = {
          filters: {},
          _searchTimeout: null,
          _currentSearchValue: '',
        };
      }

      const existingFilters = this.contexts[contextKey].filters;
      const hasExistingFilters =
        Object.keys(existingFilters).length > 0 &&
        Object.values(existingFilters).some(
          (v) => v !== undefined && v !== null && String(v).trim() !== '',
        );

      if (!force && hasExistingFilters && Object.keys(initialFilters).length === 0) {
        return;
      }

      if (Object.keys(initialFilters).length === 0 && !skipUrlRead) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilters: FilterParams = {};

        urlParams.forEach((value, key) => {
          if (key === 'page') {
            urlFilters[key] = parseInt(value, 10);
          } else if (key === 'search') {
            urlFilters.name = value;
          } else if (key === 'setor') {
            urlFilters.departmentUuid = value;
          } else if (key === 'prioridade') {
            urlFilters.priority = value;
          } else if (key === 'colaborador') {
            urlFilters.targetUserUuid = value;
          } else {
            urlFilters[key] = value;
          }
        });

        if (!hasExistingFilters || force) {
          this.contexts[contextKey].filters = {
            ...this.contexts[contextKey].filters,
            ...urlFilters,
          };
        }
      } else {
        const cleanedFilters = Object.fromEntries(
          Object.entries(initialFilters).filter(([, value]) => {
            if (value === undefined || value === null) return false;
            const stringValue = String(value).trim();
            return stringValue !== '';
          }),
        );

        this.contexts[contextKey].filters = {
          ...this.contexts[contextKey].filters,
          ...cleanedFilters,
        };
      }
    },

    initialize(routeName: string, initialFilters: FilterParams = {}, skipUrlRead = false) {
      this.routeName = routeName;

      if (!skipUrlRead && Object.keys(initialFilters).length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilters: FilterParams = {};

        urlParams.forEach((value, key) => {
          if (key === 'page') {
            urlFilters[key] = parseInt(value, 10);
          } else if (key === 'search') {
            urlFilters.name = value;
          } else if (key === 'setor') {
            urlFilters.departmentUuid = value;
          } else if (key === 'prioridade') {
            urlFilters.priority = value;
          } else if (key === 'colaborador') {
            urlFilters.targetUserUuid = value;
          } else {
            urlFilters[key] = value;
          }
        });

        this.filters = { ...(this.filters || {}), ...urlFilters };
      } else {
        this.filters = { ...(this.filters || {}), ...initialFilters };
      }
    },

    applyFilters(newFilters: Partial<FilterParams> = {}, resetPage = true) {
      if (this._navigating) return;

      const targetFilters =
        this.currentContext && this.contexts[this.currentContext]
          ? this.contexts[this.currentContext].filters
          : this.filters;

      const updatedFilters = { ...targetFilters, ...newFilters };

      const cleanFilters = Object.fromEntries(
        Object.entries(updatedFilters).filter(([, value]) => {
          if (value === undefined || value === null) return false;
          const stringValue = String(value).trim();
          return stringValue !== '';
        }),
      );

      if (resetPage && !('page' in newFilters) && Object.keys(newFilters).length > 0) {
        delete cleanFilters.page;
      }

      if (this.currentContext && this.contexts[this.currentContext]) {
        this.contexts[this.currentContext].filters = cleanFilters;
      } else {
        this.filters = cleanFilters;
      }
    },

    setFilter(key: string, value: string | number | undefined) {
      this.applyFilters({ [key]: value });
    },

    setSort(sortKey: string) {
      const currentSortBy = this.currentSortBy;
      const currentSortDirection = this.currentSortDirection;

      if (currentSortBy === sortKey) {
        if (currentSortDirection === 'asc') {
          this.applyFilters({ sortBy: sortKey, sortOrder: 'desc' });
        } else if (currentSortDirection === 'desc') {
          this.clearFilter('sortBy');
          this.clearFilter('sortOrder');
        }
      } else {
        this.applyFilters({ sortBy: sortKey, sortOrder: 'asc' });
      }
    },

    setPage(value: number) {
      this.applyFilters({ page: value }, false);
    },

    clearFilter(key: string) {
      const targetFilters =
        this.currentContext && this.contexts[this.currentContext]
          ? this.contexts[this.currentContext].filters
          : this.filters;

      const newFilters = { ...targetFilters };
      delete newFilters[key];

      if (this.currentContext && this.contexts[this.currentContext]) {
        this.contexts[this.currentContext].filters = newFilters;
      } else {
        this.filters = newFilters;
      }
    },

    clearAllFilters() {
      const targetFilters =
        this.currentContext && this.contexts[this.currentContext]
          ? this.contexts[this.currentContext].filters
          : this.filters;

      const { page } = targetFilters;
      const clearedFilters = { page };

      if (this.currentContext && this.contexts[this.currentContext]) {
        this.contexts[this.currentContext].filters = clearedFilters;
      } else {
        this.filters = clearedFilters;
      }
    },

    setSearch(value: string) {
      const context =
        this.currentContext && this.contexts[this.currentContext]
          ? this.contexts[this.currentContext]
          : null;

      if (context) {
        context._currentSearchValue = value;

        if (context._searchTimeout) {
          clearTimeout(context._searchTimeout);
          context._searchTimeout = null;
        }

        context._searchTimeout = setTimeout(() => {
          const searchValue = context._currentSearchValue;

          if (searchValue.trim() === '') {
            this.clearFilter('name');
          } else {
            this.applyFilters({ name: searchValue });
          }
          context._searchTimeout = null;
        }, SEARCH_DEBOUNCE_DELAY);
      } else {
        const searchValue = value;

        if (searchValue.trim() === '') {
          this.clearFilter('name');
        } else {
          this.applyFilters({ name: searchValue });
        }
      }
    },

    syncUrl() {
      this._navigate();
    },

    _navigate() {
      if (!this.routeName || this._navigating) return;

      this.isLoading = true;
      this._navigating = true;

      const baseUrl = window.location.origin + window.location.pathname;
      const searchParams = new URLSearchParams();
      const filtersToUse = this.currentFilters;

      if (this.currentContext) {
        searchParams.set('tab', this.currentContext);
      }

      Object.keys(filtersToUse).forEach((key) => {
        if (
          filtersToUse[key] !== undefined &&
          filtersToUse[key] !== null &&
          String(filtersToUse[key]).trim() !== ''
        ) {
          let urlKey = key === 'name' ? 'search' : key;
          if (key === 'departmentUuid') {
            urlKey = 'setor';
          } else if (key === 'priority') {
            urlKey = 'prioridade';
          } else if (key === 'targetUserUuid') {
            urlKey = 'colaborador';
          }
          searchParams.set(urlKey, String(filtersToUse[key]));
        }
      });

      const finalUrl = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;

      window.history.replaceState({}, '', finalUrl);

      setTimeout(() => {
        this.isLoading = false;
        this._navigating = false;
      }, 0);
    },
  },
});
