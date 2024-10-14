// pages/api/push-event-to-cal-req
// pages/api/handle-user-request
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

  if (!request) return res.status(401).json({
    error: "There was no valid request to process. Aborted early.";
  })


}
