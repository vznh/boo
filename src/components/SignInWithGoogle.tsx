"use client"
/*
 * A button that handles OAuth2 authentication, and stores it in useTokenStore.
 * This component will deactivate itself if useTokenStore contains a value.
 */

// [START components/SignInWithGoogle]
import { parseError } from "@/utils/back";
import { useTokenStore } from "@/stores";
import firebaseClient from "@/services/firebase";

// Assuming you have already initialized Firebase in your project
// If not, you'll need to add the initialization code
//
export function SignInWithGoogleButton() {
  const { token, setToken } = useTokenStore();
  const isSignedIn = token;

  if (token) {
    return <></>;
  }

  const handleLogin = async () => {
    try {
      const response = await firebaseClient.signInWithGoogle();
      if (response.success && response.data) setToken(response.data);
    } catch (error: unknown) {
      // Convert this to be a notification later
      console.log(parseError(error));
    }
  };

  return (
    <div
      className={`
            bg-gray-900 text-white p-4 flex items-center justify-between
            w-full max-w-sm transition-colors duration-300 ease-in-out
            ${
              isSignedIn ? "cursor-default" : "cursor-pointer hover:bg-gray-800"
            }
          `}
      role={isSignedIn ? "status" : "button"}
      onClick={!isSignedIn ? handleLogin : undefined}
    >
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">
          {isSignedIn ? "Signed In" : "Not Signed In"}
        </span>
      </div>
      <div
        className={`w-2 h-2 rounded-full ${
          isSignedIn ? "bg-green-400" : "bg-yellow-400"
        }`}
      ></div>
    </div>
  );
}
// [END components/SignInWithGoogle]
