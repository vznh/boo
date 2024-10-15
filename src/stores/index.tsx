// [START stores/]
import { create } from "zustand";
import { produce } from "immer";
import { CalendarEvent } from "@/models/types";

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
// [END stores/]
