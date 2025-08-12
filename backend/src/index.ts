import express from 'express';
import dotenv from 'dotenv';

import { getRepoFiles, getUserRepos, handleGithubCallback, handleGithubLogin } from './controllers/githubController';
import { getFileContent } from './controllers/getFileContent';
import { generateTestSummariesRoute } from './controllers/generateAIsummary';
import { generateTestCode } from './controllers/generateTestCode';
import { authMiddleware } from './middleware/authMiddleware';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/github/login', handleGithubLogin);
app.get('/github/callback', handleGithubCallback);
app.get('/github/repos',authMiddleware, getUserRepos);
app.get('/repos/files',authMiddleware, getRepoFiles);
app.get('/repos/file-content',authMiddleware, getFileContent);
app.post('/generate-test-summaries',authMiddleware, generateTestSummariesRoute);
app.post("/generate-test-code",authMiddleware, generateTestCode);

const PORT=process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
