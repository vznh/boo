// services/celebrasClient
import axios from "axios";
import { parseError } from "@/utils/back";

interface CelebrasStrictFormat {
  data?: {
    "event_short": string,
    "event_long": string,
    "event_time_start"?: string,
    "event_time_end"?: string,
    "event_ddmmyy"?: string,
    "event_calendar_day"?: string;
  };
  error?: string;
}

interface CelebrasGeneralCallResponse {
  data?: any;
  success: boolean;
  error?: string;
}

interface CelebrasConversionResponse {
  data?: {};
  success: boolean;
  error?: string;
}

interface CelebrasClient {
  callCelebras(
    model?: string,
    messages?: object[],
    response_object?: object,
    max_completion_tokens?: number | string,
  ): Promise<CelebrasGeneralCallResponse>;
  convertToObject(
    request: string
  ): Promise<CelebrasConversionResponse>;
}

class CelebrasClientImpl implements CelebrasClient {
  private readonly celebrasKey: string;
  private readonly celebrasUrl: string;

  constructor(
    celebrasKey: string,
    celebrasUrl: string
  ) {
    if (!celebrasKey)
      throw new Error("no api key provided handsome king");

    this.celebrasKey = celebrasKey;
    this.celebrasUrl = celebrasUrl;
  }

  async callCelebras(
    model: string = "llama3.1-8b",
    messages: object[],
    response_object?: object | null,
    max_completion_tokens?: number | string,
  ): Promise<CelebrasGeneralCallResponse> {
    try {
      const response = await axios.post<any>(
        this.celebrasUrl,
        {
          model: model,
          messages: messages,
          response_object: response_object,
          max_completion_tokens: max_completion_tokens
        },
        {
          headers: {
            Authorization: `Bearer ${this.celebrasKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (
        response.status === 200 &&
        response.data?.choices[0].message.content
      ) {
        const parsedResponse = response.data.choices[0].message.content;
        console.log(parsedResponse);
        return { data: parsedResponse, success: true };
      }

      return { success: false, error: "There was an error fetching from Celebras." };

    } catch (error: Error | any) {
      console.error(parseError(error));
      return { success: false, error: parseError(error) };
    }
  }

  async convertToObject(request: string): Promise<CelebrasConversionResponse> {
    let messageObject = [
      {
        role: "system",
        content: `You are given a request from a user that you have to parse and convert to a JSON object. You do not need to output anything except for the JSON object.
        A strict output would look like:
        interface CalendarEvent {
          summary: "Weekly Team Meeting",
          location: "Conference Room A",
          description: "Discuss project updates and next steps.",
          start: {
            dateTime: "2023-10-15T10:00:00-07:00",
            timeZone: "America/Los_Angeles"
          },
          end: {
            dateTime: "2023-10-15T11:00:00-07:00",
            timeZone: "America/Los_Angeles"
          },
          recurrence: {
            frequency: "WEEKLY",
            daysOfWeek: ["MO"],
            until: "2023-12-31T00:00:00Z"
          },
          attendees: [
            { email: "attendee1@example.com" },
            { email: "attendee2@example.com" }
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 30 },
              { method: "popup", minutes: 15 }
            ]
          }
        };`,
      },
      {
        role: "user",
        content: `The user's request to convert to JSON is: ${request}`
      }
    ];

    const { success, data, error } = await this.callCelebras(
      "llama3.1-8b",
      messageObject,
      { "type": "json_object" }
    );

    if (success) {
      return { data: data, success: true }
    }

    return { success: false, error: error };
  }
}

const celebrasClient = new CelebrasClientImpl(
  process.env.CLOUD_CELEBRAS_SECRET_KEY || "",
  "https://api.cerebras.ai/v1/chat/completions"
);

export default celebrasClient;
