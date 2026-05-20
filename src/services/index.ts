/**
 * API service entry point — Supabase backend.
 */
import { apiClient } from "./apiClient";

export const api = apiClient;
export const authApi = apiClient;

export type ApiService = typeof api;
