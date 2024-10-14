// [START services/firebase]
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  Auth,
  UserCredential,
  GoogleAuthProvider
} from "firebase/auth";
import { OAuth2Client } from "google-auth-library";
import { CalendarEvent } from "@/models/types";
import { calendar_v3 } from "googleapis";

export interface EventResponseConfirmation {
  data?: any;
  success: boolean;
  error?: string;
}

interface FirebaseClient {
  auth: ReturnType<typeof getAuth>;
  signInWithGoogle: () => Promise<UserCredential>;
  insertEvent: (token: string, event: CalendarEvent) => Promise<EventResponseConfirmation>;
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
    const result = await signInWithPopup(
      this.auth, provider
    );
    return result;
  }

  public async insertEvent(
    token: string, event: any
  ): Promise<EventResponseConfirmation> {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    ).setCredentials({ access_token: token });

    const calendar = new Calendar({ auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.data;
  }
}

const firebaseClient = FirebaseClientImpl.getInstance();

export default firebaseClient;
