import type { User } from '@/models';

class StorageService {
  private readonly accessTokenKey = 'accessToken';
  private readonly refreshTokenKey = 'refreshToken';
  private readonly userKey = 'user';
  private readonly ticketsViewKey = 'ticketsViewPreference';
  private readonly themeKey = 'theme';

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  setAccessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  removeAccessToken() {
    localStorage.removeItem(this.accessTokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenKey);
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  setUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  removeUser() {
    localStorage.removeItem(this.userKey);
  }

  getTicketsViewPreference(): 'table' | 'kanban' {
    const preference = localStorage.getItem(this.ticketsViewKey);
    return preference === 'kanban' ? 'kanban' : 'table';
  }

  setTicketsViewPreference(view: 'table' | 'kanban') {
    localStorage.setItem(this.ticketsViewKey, view);
  }

  isDarkMode(): boolean {
    return localStorage.getItem(this.themeKey) === 'dark';
  }

  setTheme(theme: 'light' | 'dark') {
    localStorage.setItem(this.themeKey, theme);
  }

  clear(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  }
}

export const localStorageService = new StorageService();
