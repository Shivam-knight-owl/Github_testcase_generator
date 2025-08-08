import express from 'express';
import dotenv from 'dotenv';

import { getRepoFiles, getUserRepos, handleGithubCallback, handleGithubLogin } from './controllers/githubController';
import { getFileContent } from './controllers/getFileContent';
import { generateTestSummariesRoute } from './controllers/generateAIsummary';
import { generateTestCode } from './controllers/generateTestCode';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/github/login', handleGithubLogin);
app.get('/github/callback', handleGithubCallback);
app.get('/github/repos', getUserRepos);
app.get('/repos/files', getRepoFiles);
app.get('/repos/file-content', getFileContent);
app.post('/generate-test-summaries', generateTestSummariesRoute);
app.post("/generate-test-code", generateTestCode);

const PORT=process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
