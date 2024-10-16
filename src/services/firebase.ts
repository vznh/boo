/**
 * This module provides an singleton implementation of Firebase client operations,
 * including Google sign-in and event insertion into Google Calendar.
 *
 * It defines the `EventResponseConfirmation` interface for handling
 * responses from event operations, as well as the `FirebaseClient`
 * interface outlining the necessary methods and properties. The
 * `FirebaseClientImpl` class implements this interface and is a
 * singleton that initializes the Firebase app and Auth object.
 *
 * Key functionalities include signing in with Google and inserting
 * calendar events, with appropriate error handling and response
 * confirmation.
 *
 * You can use this in any file by importing the firebaseClient as a default import.
 */

// [START services/firebase]
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  Auth,
  UserCredential,
  GoogleAuthProvider,
  OAuthCredential,
} from "firebase/auth";
import { parseError } from "@/utils/back";

interface CredentialRequestResponse {
  data?: string;
  success: boolean;
  error?: string;
}

/**
 * Interface defining the methods for Firebase Client Operations.
 */
interface FirebaseClient {
  /** Firebase Auth object used for authentication. */
  auth: Auth;

  /**
   * Signs in with Google using a popup.
   * @returns A promise that resolves with the UserCredential on successful sign-in.
   */
  signInWithGoogle: () => Promise<CredentialRequestResponse>;
}

export class FirebaseClientImpl implements FirebaseClient {
  public auth: Auth;
  private static clientInstance: FirebaseClientImpl;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  /**
   * Retrieves the singleton instance of FirebaseClientImpl.
   * @returns The instance of FirebaseClientImpl.
   */
  public static getClientInstance(): FirebaseClientImpl {
    if (!this.clientInstance) {
      this.clientInstance = new FirebaseClientImpl();
    }

    return this.clientInstance;
  }

  /**
   * Signs in with Google using a popup.
   * @returns A promise that resolves with the UserCredential on successful sign-in.
   */
  public async signInWithGoogle(): Promise<CredentialRequestResponse> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/calendar");
      const result = await signInWithPopup(this.auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential!.accessToken;

      return { data: token, success: true };
    } catch (error: any | unknown) {
      return { success: false, error: "Signing in with Google returned an error, or no credentials."}
    }
  }
}

const firebaseClient = FirebaseClientImpl.getClientInstance();

export default firebaseClient;

// [END services/firebase]
