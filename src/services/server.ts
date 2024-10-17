// [START services/server]
import { FirebaseClientImpl } from "@/services/firebase";
import { CalendarEvent } from "@/models/types";
import { google, calendar_v3 } from "googleapis";
import { parseError } from "@/utils/back";

/**
 * This interface represents a confirmation response for an event.
 * If the response is successful, the combination of proceeding data and a success flag will be raised.
 * If the response fails, the combination of a failure flag and possible error messages will be returned.
 */
export interface EventResponseConfirmation {
  data?: any;
  success: boolean;
  error?: string;
}

export class FirebaseServerImpl extends FirebaseClientImpl {
  private static serverInstance: FirebaseServerImpl;

  private constructor() {
    super();
  }

  public static getServerInstance(): FirebaseServerImpl {
    if (!this.serverInstance) {
      this.serverInstance = new FirebaseServerImpl();
    }

    return this.serverInstance;
  }

  /**
   * Inserts an event into the calendar.
   * @param token - The access token for Google API authentication.
   * @param event - The CalendarEvent object representing the event to be inserted.
   * @returns A promise that resolves with an EventResponseConfirmation indicating the result of the insert operation.
   */
  public async insertEvent(
    token: string,
    event: CalendarEvent,
  ): Promise<EventResponseConfirmation> {
    try {
      const oauth2Client = new google.auth.OAuth2();
      console.log("Token being pushed to server-side: " + token);
      oauth2Client.setCredentials({ access_token: token });

      const calendarInst = google.calendar({ version: "v3", auth: oauth2Client });
      const response = await calendarInst.events.insert({
        calendarId: "primary",
        requestBody: event as calendar_v3.Schema$Event
      });

      return response.data ? { success: true, data: response } : { success: false, error: "There was an error attempting to insert an event. Data did not succeed. Additional details (if present): " + parseError(response.data) };
    } catch (error: any | unknown) {
      return {
        success: false,
        error:
          "There was an error attempting to insert an event. Additional details (if present): " +
          parseError(error),
      };
    }
  }
}

const firebaseServer = FirebaseServerImpl.getServerInstance();
export default firebaseServer;
// [END services/server]
