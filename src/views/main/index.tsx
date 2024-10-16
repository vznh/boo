// views/index.tsx
import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { parseError } from "@/utils/back";
import { CalendarEvent } from "@/models/types";
import { useTokenStore } from "@/stores";
import { InterHeading, NotoBody, QuatHeading } from "@/models/fonts";
import { SignInWithGoogleButton } from "@/components/SignInWithGoogle";

export default function MainDashboard() {
  const [inputValue, setInputValue] = useState<string>("");
  const { token } = useTokenStore();

  const isUserSignedIn = token;
  const [queuedEvent, setQueuedEvent] = useState<CalendarEvent | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      console.log(
        "Started converting the user's request to a suitable format..."
      );

      const ur = await axios.post("/api/handle-user-request", {
        request: inputValue,
      });

      if (ur.data.conversion) {
        console.log("Fetched data conversion successfully..");
        console.log(`Conversion: ${ur.data.conversion}`);
        setQueuedEvent(ur.data.conversion);
      }

      console.log("Started attempt to push event onto user's calendar...");

      console.log(`Parameters: token ${token}; request: ${queuedEvent}`);

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
      <header className="flex flex-row p-4 justify-end">
        <span className="text-sm text-white font-bold">
          <a href="https://github.com/vznh/charlie"><span className="text-md pr-1">&#10043;</span> Pre-alpha</a>
        </span>
      </header>
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className={`${QuatHeading.className} tracking-tight text-6xl font-bold mb-8`}>
            <span className="text-5xl pr-2">&#9741;</span> How can I make your day?
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
                className="ml-2 px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &#10228;
              </button>
            </form>
            <SignInWithGoogleButton />
          </div>
        </main>
        <footer className="p-4 flex justify-center gap-4 text-6xl text-opacity-20 text-white">
        </footer>
      </div>
    );
  }

  return testView();
// return isUserSignedIn ? testView() : promptLoginView()
}
