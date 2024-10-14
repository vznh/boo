// views/index.tsx
import { useState, FormEvent } from "react";
import axios from "axios";

export default function MainDashboard() {
  const [inputValue, setInputValue] = useState<string>("");

  const [userIsNotSignedIn, setUserIsNotSignedIn] = useState<boolean>();

  const [output, setOutput] = useState<string>("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    console.log("Calling the API with request: " + inputValue);
    const response = await axios.post(
      "/api/handle-user-request", {
      request: inputValue
    });

    if (response.data.conversion) {
      setOutput(JSON.stringify(response.data.conversion));
    } else {
      // Throw a new interface error
      console.error(response.data.error)
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
