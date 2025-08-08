import { Request, Response } from "express";
import { getGeminiResponse } from "../utils/generateTestcases";

export const generateTestCode = async (req: Request, res: Response) => {
  try {
    const { filePath, fileContent } = req.body;

    if (!filePath || !fileContent) {
      return res.status(400).json({ error: "filePath and fileContent are required" });
    }

    const prompt = `
        You are a software test engineer.

        Write complete automated test code for the following file: ${filePath}

        \`\`\`
        ${fileContent}
        \`\`\`

        Use an appropriate testing framework based on the language (e.g., Jest for JavaScript/TypeScript, Pytest for Python, JUnit for Java).

        Only output the test code. Do not explain anything. Wrap the entire output in code blocks.
        `;

    const testCode = await getGeminiResponse(prompt);
    console.log("Generated test code:", testCode);

    return res.status(200).json({ testCode });
  } catch (error) {
    console.error("Error generating test code:", error);
    return res.status(500).json({ error: "Failed to generate test code" });
  }
};
