import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to handle GitHub login
export const handleGithubLogin = (req: Request, res: Response) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
  res.redirect(redirectUrl);
};

//callback function to handle the GitHub OAuth flow
export const handleGithubCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send('No authorization code provided');
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).send('Failed to get access token');
    }

    // Get GitHub user info to avoid duplicates
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userResponse.data;

    // Use upsert instead of create to avoid duplicates
        const savedUser = await prisma.user.upsert({
      where: { githubId: githubUser.id.toString() },
      update: { 
        accessToken: accessToken,
        username: githubUser.login,
        email: githubUser.email,
      },
      create: {
        githubId: githubUser.id.toString(),
        accessToken: accessToken,
        username: githubUser.login,
        email: githubUser.email,
      },
    });

    res.json({
      message: 'Success',
      userId: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('OAuth Failed');
  }
};

// Function to get user repositories
export const getUserRepos = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in query' });
  }

  try {
    // 1. Get user from DB
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.accessToken) {
      return res.status(404).json({ error: 'User not found or not authenticated with GitHub' });
    }

    // 2. Fetch repos from GitHub
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const repos = response.data.map((repo: any) => ({
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      private: repo.private,
    }));

    res.json({ repos });
  } catch (error) {
    console.error('Error fetching repos:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub repos' });
  }
};

//get all code files in the repository
// Get all code files in a repo
export const getRepoFiles = async (req: Request, res: Response) => {
  const { userId, repo } = req.query as { userId: string; repo: string };

  if (!userId || !repo) {
    return res.status(400).json({ error: 'Missing userId or repo name' });
  }

  try {
    // Fetch user from DB
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.accessToken || !user.username) {
      return res.status(404).json({ error: 'User not found or not authenticated' });
    }

    // 1. Get default branch
    const repoInfo = await axios.get(`https://api.github.com/repos/${user.username}/${repo}`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    const defaultBranch = repoInfo.data.default_branch;

    // 2. Get full tree of the repo
    const treeResp = await axios.get(
      `https://api.github.com/repos/${user.username}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      }
    );

    const files = treeResp.data.tree
      .filter((item: any) => item.type === 'blob') // only files
      .map((item: any) => item.path)
      .filter((path: string) =>
        path.endsWith('.js') ||
        path.endsWith('.ts') ||
        path.endsWith('.jsx') ||
        path.endsWith('.tsx') ||
        path.endsWith('.py') ||
        path.endsWith('.java')
      );

    res.json({ files });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};
