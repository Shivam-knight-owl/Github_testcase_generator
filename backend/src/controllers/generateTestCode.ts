import { Request, Response } from "express";
import { getGeminiResponse } from "../utils/generateTestcases";

export const generateTestCode = async (req: Request, res: Response) => {
  try {
    const { filePath, fileContent } = req.body;

    if (!filePath || !fileContent) {
      return res.status(400).json({ error: "filePath and fileContent are required" });
    }

    const prompt = `
        You are a senior software test engineer.

        Write complete, production-ready automated test code for the following file: ${filePath}

        ---
        SOURCE FILE:
        ${fileContent}
        ---

        Rules:
        1. Select the most appropriate testing framework based on the file's language 
          (e.g., Jest for JavaScript/TypeScript, Pytest for Python, JUnit for Java).
        2. Output ONLY the full, runnable test code as a markdown code block with the correct language tag (e.g., \`\`\`typescript).
        3. The entire output must be inside a single markdown code block.
        4. Do NOT add any explanations or text outside the code block.
        5. Include clear inline comments explaining the test cases and important logic.
        6. Ensure proper imports, setup, and teardown where required.
        7. Code should be ready to paste directly into a Toast UI Editor in markdown mode.
        8. Follow standard style and conventions of the chosen framework.
        `;
    const testCode = await getGeminiResponse(prompt);
    console.log("Generated test code:", testCode);

    return res.status(200).json({ testCode });
  } catch (error) {
    console.error("Error generating test code:", error);
    return res.status(500).json({ error: "Failed to generate test code" });
  }
};
