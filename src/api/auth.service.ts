import { api } from '@api/axiosInstance';
import { StorageKey } from '@app-types/enums';
import { IUser } from '@app-types/interfaces/user.interface';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    accessToken: string;
  };
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const { user } = response.data;

    this.setAccessToken(user.accessToken);
    this.setUser({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });

    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { user } = response.data;

    this.setAccessToken(user.accessToken);
    this.setUser({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });

    return response.data;
  }

  // async refreshTokens(): Promise<{ accessToken: string }> {
  //   const response = await api.post('/auth/refresh', {});
  //   const { user } = response.data;
  //
  //   this.setAccessToken(user.accessToken);
  //
  //   return {
  //     accessToken: user.accessToken,
  //   };
  // }

  logout(): void {
    this.clearTokens();
    api.post('/auth/logout').catch(() => {});
  }

  // getters
  getAccessToken(): string | null {
    return localStorage.getItem(StorageKey.AccessToken);
  }

  getUser(): IUser | null {
    const userStr = localStorage.getItem(StorageKey.User);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // setters
  setAccessToken(token: string): void {
    localStorage.setItem(StorageKey.AccessToken, token);
  }

  setUser(user: IUser): void {
    localStorage.setItem(StorageKey.User, JSON.stringify(user));
  }

  clearTokens(): void {
    localStorage.removeItem(StorageKey.AccessToken);
    localStorage.removeItem(StorageKey.User);
  }
}

export const authService = new AuthService();
