// [START stores/index]
import { create } from "zustand";
import { produce } from "immer";
import { CalendarEvent } from "@/models/types";

/**
 * Represents the store for managing user authentication tokens.
 * @interface TokenStore
 * @property {string | null} token - The current authentication token. Null if not set.
 * @property {function} setToken - Function to set the authentication token.
 */
interface TokenStore {
  token: string | null;
  setToken: (token: string) => void;
}

/**
 * Represents the store for managing calendar events.
 * @interface CalendarStore
 * @property {Array<CalendarEvent>[]} events - An array of calendar events.
 * @property {function} add - Function to add a new event to the store.
 */
interface CalendarStore {
  events: Array<CalendarEvent>[]; // Replace with queue later
  add: (x: any) => void;
}

/**
 * A store for managing calendar events.
 * @function useCalendarStore
 * @returns {CalendarStore} The calendar store with events and add functionality.
 */
export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  add: (event) => set(produce((state) => {
    state.events.push(event);
  })),
}));

/**
 * A store for managing the authentication token.
 * @function useTokenStore
 * @returns {TokenStore} The token store with the current token and a function to set it.
 */
export const useTokenStore = create<TokenStore>((set) => ({
  token: null,
  setToken: (token) => set(produce((state) => {
    state.token = token;
  })),
}));

// [END stores/index]
