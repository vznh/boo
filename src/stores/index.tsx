// [START stores/]
import { create } from "zustand";
import { produce } from "immer";
import { CalendarEvent } from "@/models/types";
import { UserCredential } from "firebase/auth";

interface TokenStore {
  token: UserCredential | null;
  setToken: (token: UserCredential) => void;
}

interface CalendarStore {
  events: Array<CalendarEvent>[]; // Replace with queue later
  add: (x: any) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  add: (event) => set(produce((state) => {
    state.events.push(event);
  })),
}));

export const useTokenStore = create<TokenStore>((set) => ({
  token: {} as UserCredential,
  setToken: (token) => set(produce((state) => {
    state.token = token;
  })),
}));

// [END stores/]
