import { defineStore } from 'pinia';

const SEARCH_DEBOUNCE_DELAY = 300;

export interface FilterParams {
  [key: string]: string | number | undefined;
}

interface FiltersState {
  filters: FilterParams;
  isLoading: boolean;
  routeName: string;
  _navigating: boolean;
  _searchTimeout: NodeJS.Timeout | null;
  _currentSearchValue: string;
}

export const useFiltersStore = defineStore('filters', {
  state: (): FiltersState => ({
    filters: {},
    isLoading: false,
    routeName: '',
    _navigating: false,
    _searchTimeout: null,
    _currentSearchValue: '',
  }),

  getters: {
    activeFilters(): FilterParams {
      return Object.fromEntries(
        Object.entries(this.filters).filter(([key, value]) => {
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
      return this.filters.sortBy as string | undefined;
    },

    currentSortOrder(): 'asc' | 'desc' | undefined {
      return this.filters.sortOrder as 'asc' | 'desc' | undefined;
    },

    currentSortDirection(): 'asc' | 'desc' | 'none' {
      const sortBy = this.filters.sortBy as string | undefined;
      const sortOrder = this.filters.sortOrder as 'asc' | 'desc' | undefined;

      if (sortBy && sortOrder) {
        return sortOrder;
      }
      return 'none';
    },

    currentPage(): number {
      return (this.filters.page as number) || 1;
    },

    currentSearch(): string | undefined {
      return this.filters.name as string | undefined;
    },
  },

  actions: {
    initialize(routeName: string, initialFilters: FilterParams = {}) {
      this.routeName = routeName;

      // Read URL parameters if no initial filters provided
      if (Object.keys(initialFilters).length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilters: FilterParams = {};

        // Read all URL parameters
        urlParams.forEach((value, key) => {
          if (key === 'page') {
            urlFilters[key] = parseInt(value, 10);
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
      // Prevent multiple calls
      if (this._navigating) return;

      // Merge new filters with existing ones
      const updatedFilters = { ...this.filters, ...newFilters };

      // Clean empty values - remove parameters that are empty strings, undefined, or null
      const cleanFilters = Object.fromEntries(
        Object.entries(updatedFilters).filter(([, value]) => {
          if (value === undefined || value === null) return false;
          const stringValue = String(value).trim();
          return stringValue !== '';
        }),
      );

      // Reset page when filters change (except when page itself changes)
      if (resetPage && !('page' in newFilters) && Object.keys(newFilters).length > 0) {
        delete cleanFilters.page;
      }

      this.filters = cleanFilters;
      this._navigate();
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
        // New sort key, default to asc
        this.applyFilters({ sortBy: sortKey, sortOrder: 'asc' });
      }
    },

    setPage(value: number) {
      this.applyFilters({ page: value }, false);
    },

    clearFilter(key: string) {
      const newFilters = { ...this.filters };
      delete newFilters[key];
      this.filters = newFilters;
      this._navigate();
    },

    clearAllFilters() {
      // Preserve only page
      const { page } = this.filters;
      this.filters = { page };
      this._navigate();
    },

    // Debounced search method
    setSearch(value: string) {
      // Store the current search value immediately
      this._currentSearchValue = value;

      // Clear any existing timeout
      if (this._searchTimeout) {
        clearTimeout(this._searchTimeout);
        this._searchTimeout = null;
      }

      this._searchTimeout = setTimeout(() => {
        // Use the stored value to ensure we have the latest
        const searchValue = this._currentSearchValue;

        if (searchValue.trim() === '') {
          this.clearFilter('name');
        } else {
          this.applyFilters({ name: searchValue });
        }
        this._searchTimeout = null;
      }, SEARCH_DEBOUNCE_DELAY);
    },

    _navigate() {
      if (!this.routeName || this._navigating) return;

      this.isLoading = true;
      this._navigating = true;

      // Build URL from scratch to avoid stale parameters
      const baseUrl = window.location.origin + window.location.pathname;

      // Build search params from current filters only
      const searchParams = new URLSearchParams();
      Object.keys(this.filters).forEach((key) => {
        if (
          this.filters[key] !== undefined &&
          this.filters[key] !== null &&
          String(this.filters[key]).trim() !== ''
        ) {
          searchParams.set(key, String(this.filters[key]));
        }
      });

      // Construct final URL
      const finalUrl = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;

      window.history.replaceState({}, '', finalUrl);

      // Simulate async completion
      setTimeout(() => {
        this.isLoading = false;
        this._navigating = false;
      }, 0);
    },
  },
});
