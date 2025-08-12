import { Request, Response } from "express";
import { generateTestSummaries } from "../utils/AImodel";

export async function generateTestSummariesRoute(req: Request, res: Response) {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid request. Missing 'files'." });
    }

    const summaries = await generateTestSummaries(files);
    res.json({ summaries });
  } catch (error) {
    console.error("AI summary error:", error);
    res.status(500).json({ error: "AI failed to summarize." });
  }
}
