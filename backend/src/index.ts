import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

import { getRepoFiles, getUserRepos, handleGithubCallback, handleGithubLogin } from './controllers/githubController';
import { getFileContent } from './controllers/getFileContent';
import { generateTestSummariesRoute } from './controllers/generateAIsummary';
import { generateTestCode } from './controllers/generateTestCode';
import { authMiddleware } from './middleware/authMiddleware';
import cookieParser from 'cookie-parser';
import { getUserDetails } from './controllers/getUserDetails';

dotenv.config();
const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/github/login', handleGithubLogin);
app.get('/github/callback', handleGithubCallback);
app.get('/github/repos',authMiddleware, getUserRepos);
app.get('/repos/files',authMiddleware, getRepoFiles);
app.get('/repos/file-content',authMiddleware, getFileContent);
app.post('/generate-test-summaries',authMiddleware, generateTestSummariesRoute);
app.post("/generate-test-code",authMiddleware, generateTestCode);
app.get('/auth/user',authMiddleware, getUserDetails);

const PORT=process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
