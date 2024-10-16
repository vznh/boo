/**
 * A route that handles taking a user's pure string request and turning it into a plausible JSON object.
 * @param {string} request - Pure, unadulterated string.
 * @returns { CalendarEvent } conversion - Parsed JSON object that can be placed into a Google Calendar object.
 *
 */

// [START pages/api/handle-user-request]
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { AxiosError } from "axios";
import { getCurrentStatus, parseError } from "@/utils/back";

interface InterfaceResponse {
  conversion?: object;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InterfaceResponse>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Was called with the wrong method." });
  }

  const { request } = req.body;

  if (!request) {
    return res
      .status(602)
      .json({ error: "Request body is missing 'request'." });
  }

  try {
    const response = await axios.post(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        messages: [
          {
            role: "system",
            content: `You are given a request from a user that you have to parse and convert to a JSON object.
                    A strict output would look like:
                    {
                      summary: string; // Most concise summary of event, no abbreviations/stand-fors
                      location: string; // Standalone string
                      description: string; // Concise one-sentence summary of event
                      start: {
                        dateTime: string; // ISO 8601 date-time string representing the start of the event
                        timeZone: string; // IANA time zone string for the event's time zone
                      };
                      end: {
                        dateTime: string; // ISO 8601 date-time string representing the end of the event
                        timeZone: string; // IANA time zone string for the event's time zone
                      };
                      recurrence?: string; // Recurrence rule in RRULE format (e.g., "RRULE:FREQ=WEEKLY;BYDAY=MO")
                      attendees?: string[]; // Array of email addresses
                      reminders?: {
                        useDefault: boolean; // Indicator whether to use default reminders
                        overrides: {
                          method: string; // Notification method (e.g., "email", "popup")
                          minutes: number; // Number of minutes before the event to send the reminder
                        }[]; // Array of reminder override objects
                      };
                    }

                    You are also to notice abbreviations and interpret: examples would be mwf: Monday, Wednesday, Friday; and mo: month, yr: year, hr: hr, etc...; and whatever the user requests as a time will be the time range for the calendar event. And all descriptions will be one concise sentence long. Only include an organized title for the calendar entry, with no abbreviations unless strictly needed. You can assume the time is set in America/Los_Angeles. It's okay to leave fields empty if not explicitly given. When constructing RRULE: use UNTIL Instead: Instead of COUNT, use the UNTIL parameter to specify the end date of the recurrence. This will ensure that the event repeats for the desired duration. Additionally, BYDAY=MO,WE,FR : This specifies that the event should repeat weekly on Mondays, Wednesdays, and Fridays. The correct abbreviations for the days of the week are MO , TU , WE , TH , FR , SA , and SU. You should always have a Z at the end of the RRULE as well.
                    An example RFC5545 RRULE looks like: "RRULE:FREQ=WEEKLY;UNTIL=20110701T170000Z"`,
          },
          {
            role: "assistant",
            content: `String to convert to JSON object for processing: ${request}, and strictly current date and time of request: ${getCurrentStatus()}. You can assume that the date and time will be in Pacific Daylight Time. If there is no date and time given by the user, supply this instead.`,
          },
        ],
        model: "llama3.1-8b",
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUD_CELEBRAS_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200) {
      const parsedResponse = response.data.choices[0].message.content;
      return res.status(200).json({ conversion: parsedResponse });
    }
  } catch (error: Error | AxiosError | unknown) {
    return res.status(601).json({
      error: `The request was successful, but Celebras did not return a valid response in order to create an event. A detailed error message: ${parseError(error)}`,
    });
  }

  return res.status(601).json({
    error: `The request was successful, but Celebras did not return a valid response in order to create an event.`,
  });
}

// [END pages/api/handle-user-request.ts]
