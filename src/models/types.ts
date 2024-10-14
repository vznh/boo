export interface CalendarEvent {
  summary: string; // Most concise summary of event, no abbreviations/stand-fors
  location: string; // Standalone string
  description: string; // Concise one-sentence summary of event
  start: {
    dateTime: string; // ISO 8601 date-time string representing the start of the event
    timeZone: string; // IANA time zone string for the event's time zone
  };
  end: {
    dateTime: string; // ISO 8601 date-time string representing the end of the event
    timeZone: string; // IANA time zone string for the event's time zone
  };
  recurrence: {
    frequency: string; // Recurrence frequency (e.g., "DAILY", "WEEKLY", etc.)
    daysOfWeek: string[]; // Array of days of the week as strings (e.g., ["MO", "TU"])
    until: string; // ISO 8601 date string indicating the last date of the recurrence
  };
  attendees: {
    email: string; // Email address of the attendee
  }[]; // Array of attendee objects, each containing an email property
  reminders: {
    useDefault: boolean; // Indicator whether to use default reminders
    overrides: {
      method: string; // Notification method (e.g., "email", "popup")
      minutes: number; // Number of minutes before the event to send the reminder
    }[]; // Array of reminder override objects
  };
}
