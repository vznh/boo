/**
 * Pushes an object of type CalendarEvent to a linked calendar.
 * @param {CalendarEvent} request - Aforementioned object. See models/types for more information.
 * @param {string} token - Authorization token needed to push objects onto the calendar.
 * @returns {NextApiResponse<InterfaceResponse>} res - Object that contains a status code, success flag, and optional error coding. Will always return a success flag.
 */
// [START pages/api/push-event-to-cal-req]
import type { NextApiRequest, NextApiResponse } from "next";
import { CalendarEvent } from "@/models/types";
import { parseError } from "@/utils/back";
import firebaseServer from "@/services/server";

interface InterfaceResponse {
  success: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InterfaceResponse>,
) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Was called with the wrong method." });
  }

  const { request, token } = req.body;
  if (!request && !(request satisfies CalendarEvent)) {
    return res.status(401).json({
      success: false,
      error: "There was no valid request to process. Aborted early.",
    });
  }

  try {
    const response = await firebaseServer.insertEvent(token, request);
    console.error(response.data);
  } catch (error: any | unknown) {
    console.error(parseError(error));
    return res.status(600).json({ success: false, error: parseError(error) });
  }
}

// [END pages/api/push-event-to-cal-req]
