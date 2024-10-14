// [START components/SignInWithGoogle]
import { useState } from "react";
import firebaseClient from "@/services/firebase";
import { parseError } from "@/utils/back";
import { UserCredential } from "firebase/auth";
import { Button } from "@/components/ui/Button";

// Assuming you have already initialized Firebase in your project
// If not, you'll need to add the initialization code
//
export function SignInWithGoogleButton() {
  // Google states
  const [userCredentials, setUserCredentials] = useState<UserCredential | null>(null);

  async function handleLogin() {
    try {
      const userCredential = await firebaseClient.signInWithGoogle();
      setUserCredentials(userCredential);
      console.log("User logged in: ", userCredential.user);
    } catch (error: unknown) {
      console.log(parseError(error));
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full max-w-xs bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-300"
      onClick={handleLogin}
    >
      <span className="flex items-center justify-center">
        <span className="text-blue-500 font-medium mr-2">G</span>
        <span className="font-normal">Sign in with Google</span>
      </span>
    </Button>
  )
}
// [END components/SignInWithGoogle]
