import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/services";
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  UserPublic,
} from "@/types";

interface AuthState {
  user: UserPublic | null;
  loading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      hydrate: async () => {
        const user = await api.getCurrentUser();
        set({ user });
      },

      login: async (input) => {
        set({ loading: true, error: null });
        try {
          const user = await api.login(input);
          set({ user, loading: false });
        } catch (e) {
          set({ error: (e as Error).message, loading: false });
          throw e;
        }
      },

      register: async (input) => {
        set({ loading: true, error: null });
        try {
          const user = await api.register(input);
          set({ user, loading: false });
        } catch (e) {
          set({ error: (e as Error).message, loading: false });
          throw e;
        }
      },

      logout: () => {
        void api.logout();
        set({ user: null, error: null });
      },

      updateProfile: async (input) => {
        const { user } = get();
        if (!user) throw new Error("Oturum bulunamadı");
        const updated = await api.updateProfile(user.id, input);
        set({ user: updated });
      },
    }),
    {
      name: "print3d_auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
