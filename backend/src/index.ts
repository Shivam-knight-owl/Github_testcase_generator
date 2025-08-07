import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { getRepoFiles, getUserRepos, handleGithubCallback, handleGithubLogin } from './controllers/githubController';
import { getFileContent } from './controllers/getFileContent';

dotenv.config();
const app = express();

app.get('/github/login', handleGithubLogin);
app.get('/github/callback', handleGithubCallback);
app.get('/github/repos', getUserRepos);
app.get('/repos/files', getRepoFiles);
app.get('/repos/file-content', getFileContent);


const PORT=process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
