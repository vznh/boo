// [START services/firebase]
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  Auth,
  UserCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { CalendarEvent } from "@/models/types";
import { google } from "googleapis";
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

interface FirebaseClient {
  auth: Auth;
  signInWithGoogle: () => Promise<UserCredential>;
  insertEvent: (
    token: string,
    event: CalendarEvent,
  ) => Promise<EventResponseConfirmation>;
}

class FirebaseClientImpl implements FirebaseClient {
  public auth: Auth;

  private static instance: FirebaseClientImpl;

  private constructor() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  public static getInstance(): FirebaseClientImpl {
    if (!this.instance) {
      this.instance = new FirebaseClientImpl();
    }

    return this.instance;
  }

  public async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result;
  }

  public async insertEvent(
    token: string,
    event: CalendarEvent,
  ): Promise<EventResponseConfirmation> {
    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({ access_token: token });

    const calendarInst = google.calendar({ version: "v3", auth: oauth2Client });
    try {
      const response = calendarInst.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      return { success: true, data: response };
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

const firebaseClient = FirebaseClientImpl.getInstance();

export default firebaseClient;
