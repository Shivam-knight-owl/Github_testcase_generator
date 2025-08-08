import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateTestSummaries(files: {
  filePath: string;
  fileContent: string;
}[]): Promise<{ filePath: string; fileContent: string; summary: string }[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const results: { filePath: string; fileContent: string; summary: string }[] = [];

  for (const file of files) {
    const prompt = `
        You are a software QA expert.

        Here is a code file: ${file.filePath}

        \`\`\`
        ${file.fileContent}
        \`\`\`

        List 3–4 high-level automated test cases (in points only). 
        Do not add any explanation or intro—just points.
        `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    console.log(`Summary for ${file.filePath}:`, summary);

    results.push({
      filePath: file.filePath,
      fileContent: file.fileContent,
      summary,
    });
  }

  return results;
}
