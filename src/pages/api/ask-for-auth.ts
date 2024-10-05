// pages/api/ask-for-auth
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.status(200).json({ name: "John Doe" });
}
