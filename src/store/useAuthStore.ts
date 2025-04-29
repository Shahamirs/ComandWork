import { create } from 'zustand';
import {IUser} from '../types.ts';



interface AuthState extends IUser {
  setUser: (username: string, id: number) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  id:null,
  username: null,
  accessToken: null,
  refreshToken: null,
  setUser: (username, id) => {
    set({ username, id });
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken });
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ accessToken: null, refreshToken: null });
  },
}));
