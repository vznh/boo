/*
 * A button that handles OAuth2 authentication, and stores it in useTokenStore.
 * This component will deactivate itself if useTokenStore contains a value.
 */

// [START components/SignInWithGoogle]
import firebaseClient from "@/services/firebase";
import { parseError } from "@/utils/back";
import { Button } from "@/components/ui/Button";
import { IconBrandGoogle } from "tabler-icons";
import { useTokenStore } from "@/stores";

// Assuming you have already initialized Firebase in your project
// If not, you'll need to add the initialization code
//
export function SignInWithGoogleButton() {
  const { token, setToken } = useTokenStore();

  if (token) {
    return <></>;
  }

  const handleLogin = async () => {
    try {
      const userCredential = await firebaseClient.signInWithGoogle();
      setToken(userCredential);

      console.log("User logged in: ", userCredential.user);
    } catch (error: unknown) {
      // Convert this to be a notification later
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
        <IconBrandGoogle className="w-4 h-4" />
        <span className="font-normal">Sign in with Google</span>
      </span>
    </Button>
  )
}
// [END components/SignInWithGoogle]
