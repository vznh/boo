// pages/api/handle-user-request
import type { NextApiRequest, NextApiResponse } from "next";
import celebrasClient from "@/services/celebrasClient";

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
    return res.status(602).json({ error: "Request body is missing 'request'." });
  }

  const response = await celebrasClient.convertToObject(request);

  if (response.success) {
    return res.status(200).json({ conversion: response.data });
  }

  return res.status(601).json({ error: "The request was successful, but Celebras did not return a valid response in order to create an event." });
}
