// views/index.tsx
import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { parseError } from "@/utils/back";
import { CalendarEvent } from "@/models/types";
import { useTokenStore } from "@/stores";
import { InterHeading, NotoBody } from "@/models/fonts";
import { SignInWithGoogleButton } from "@/components/SignInWithGoogle";

export default function MainDashboard() {
  const [inputValue, setInputValue] = useState<string>("");
  const { token } = useTokenStore();

  const isUserSignedIn = token;
  const [queuedEvent, setQueuedEvent] = useState<CalendarEvent | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    console.log(token);

    try {
      console.log(
        "Started converting the user's request to a suitable format..."
      );

      console.log(`Request: ${inputValue}`);

      const ur = await axios.post("/api/handle-user-request", {
        request: inputValue,
      });

      if (ur.data.conversion) {
        console.log("Fetched data conversion successfully..");
        console.log(`Conversion: ${ur.data.conversion}`);
        setQueuedEvent(ur.data.conversion);
      }

      console.log("Started attempt to push event onto user's calendar...");

      console.log("Token we're working with: " + token);

      const pr = await axios.post("/api/push-event-to-cal-req", {
        token: token,
        request: queuedEvent,
      });

      if (pr.data.success) {
        console.log("Data was successfully pushed onto the calendar.");
        console.log(`Calendar event: ${pr.data.data}`);
        setQueuedEvent(null);
      }
    } catch (error: AxiosError | any | unknown) {
      console.error(parseError(error));
    }

    setInputValue("");
  }

  function testView() {
    return (
      <div className="flex flex-col min-h-screen w-[100%] text-white">
        <header className="p-4 flex justify-end">
          <span className="text-sm text-white font-bold"><a href="https://github.com/vznh/charlie">Pre-alpha</a></span>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className={`${InterHeading.style.fontFamily} tracking-tighter text-4xl font-bold mb-8`}>
            How can I make your day?
          </h1>
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-1 pl-4 flex">
              <div className={`${NotoBody.style.fontFamily} tracking-wide flex items-center flex-grow`}>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={!isUserSignedIn}
                  placeholder="chaos theory lec mwf 920a to 1025a for 10wks"
                  className="flex-grow bg-transparent border-none text-white placeholder-gray-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={!isUserSignedIn || !inputValue.trim()}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </form>
            <SignInWithGoogleButton />
          </div>
        </main>
        <footer className="p-4 flex justify-center gap-4 text-sm text-white">
          <a href="https://hobin.dev" className="hover:text-gray-300">
            &#8657;
          </a>
          <a href="#" className="hover:text-gray-300">
            &#10228;
          </a>
          <a href="#" className="hover:text-gray-300">
            &#10560;
          </a>
        </footer>
      </div>
    );
  }

  return testView();
// return isUserSignedIn ? testView() : promptLoginView()
}
