// pages/api/push-event-to-cal-req
import type { NextApiRequest, NextApiResponse } from "next";
import { CalendarEvent } from "@/models/types";
import firebaseClient from "@/services/firebase";
import { parseError } from "@/utils/back";

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
  if (!request) {
    return res.status(401).json({
      success: false,
      error: "There was no valid request to process. Aborted early.",
    });
  }

  const validRequest: boolean = request satisfies CalendarEvent;
  if (!validRequest) {
    return res.status(500).json({
      success: false,
      error: "The structure of the calendar event is invalid. Aborted.",
    });
  }

  try {
    const response = await firebaseClient.insertEvent(token, request);
    return res.status(200).json({ success: true });
  } catch (error: any | unknown) {
    return res.status(600).json({ success: false, error: parseError(error) });
  }
}
