import { STORAGE_KEYS } from "@/lib/constants";
import { hashPassword, verifyPassword } from "@/lib/password";
import { generateId } from "@/lib/utils";
import type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  User,
  UserPublic,
} from "@/types";

function readUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.users);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function toPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    createdAt: user.createdAt,
  };
}

function setSession(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.session, userId);
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.session);
}

export const mockAuthService = {
  async register(input: RegisterInput): Promise<UserPublic> {
    const email = input.email.trim().toLowerCase();
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error("Bu e-posta adresi zaten kayıtlı.");
    }
    if (input.password.length < 6) {
      throw new Error("Şifre en az 6 karakter olmalıdır.");
    }

    const user: User = {
      id: generateId("user"),
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      address: input.address.trim(),
      passwordHash: await hashPassword(input.password),
      createdAt: new Date().toISOString(),
    };
    writeUsers([user, ...users]);
    setSession(user.id);
    return toPublic(user);
  },

  async login(input: LoginInput): Promise<UserPublic> {
    const email = input.email.trim().toLowerCase();
    const user = readUsers().find((u) => u.email === email);
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new Error("E-posta veya şifre hatalı.");
    }
    setSession(user.id);
    return toPublic(user);
  },

  logout(): void {
    clearSession();
  },

  async getCurrentUser(): Promise<UserPublic | null> {
    if (typeof window === "undefined") return null;
    const userId = localStorage.getItem(STORAGE_KEYS.session);
    if (!userId) return null;
    const user = readUsers().find((u) => u.id === userId);
    return user ? toPublic(user) : null;
  },

  async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<UserPublic> {
    const users = readUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error("Kullanıcı bulunamadı");
    users[index] = {
      ...users[index],
      ...input,
      name: input.name?.trim() ?? users[index].name,
      phone: input.phone?.trim() ?? users[index].phone,
      address: input.address?.trim() ?? users[index].address,
    };
    writeUsers(users);
    return toPublic(users[index]);
  },
};
