// views/index.tsx
import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { parseError } from "@/utils/back";
import { CalendarEvent } from "@/models/types";

export default function MainDashboard() {
  const [inputValue, setInputValue] = useState<string>("");

  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>();

  const [output, setOutput] = useState<string>("");
  const [queuedEvent, setQueuedEvent] = useState<CalendarEvent | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      console.log("Started converting the user's request to a suitable format...");
      const ur = await axios.post(
        "/api/handle-user-request", {
        request: inputValue
      });

      if (ur.data.conversion) {
        setOutput(JSON.stringify(ur.data.conversion));
        setQueuedEvent(ur.data.conversion);
      }

      const pr = await axios.post(
        "/api/push-event-to-cal-req",
        {
          // token: stored token goes here
          event: queuedEvent
        }
      );

      if (pr.data.success) {
        setOutput("Data was successfully pushed.");
        setQueuedEvent(null);
      }
    } catch (error: AxiosError | any | unknown) {
      console.error(parseError(error));
    }

    setInputValue("");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        <h1 className="text-3xl font-bold text-center text-primary">Start by typing any event.</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your search..."
            className="w-full bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 text-lg placeholder:text-black text-black"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
        {output}
      </div>
    </div>
  )
}
