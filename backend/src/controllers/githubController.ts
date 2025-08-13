import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

// Function to handle GitHub login
export const handleGithubLogin = (req: Request, res: Response) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
  res.redirect(redirectUrl);
};

//callback function to handle the GitHub OAuth flow
// Inside handleGithubCallback

export const handleGithubCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    // If no code, user canceled or failed OAuth - redirect to landing page
    return res.redirect(safeFrontendUrl("/"));
  }

  try {
    // Exchange code for GitHub token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      // If no access token, redirect to landing page
      return res.redirect(safeFrontendUrl("/"));
    }

    // Get GitHub user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = userResponse.data;

    // Upsert in DB
    const savedUser = await prisma.user.upsert({
      where: { githubId: githubUser.id.toString() },
      update: { accessToken, username: githubUser.login, email: githubUser.email },
      create: {
        githubId: githubUser.id.toString(),
        accessToken,
        username: githubUser.login,
        email: githubUser.email,
      },
    });

    // Create JWT
    const jwtToken = jwt.sign({ userId: savedUser.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    // Set as HTTP-only cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend home page only on successful login
    res.redirect(safeFrontendUrl("/home"));
  } catch (error) {
    console.error('OAuth error:', error);
    // On error, redirect to landing page
    res.redirect(safeFrontendUrl("/"));
  }
};


// Function to get user repositories

export const getUserRepos = async (req: AuthRequest, res: Response) => {
  const userId = req.userId; // From JWT

  if (!userId) {
    return res.status(400).json({ error: 'User ID missing from token' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.accessToken) {
      return res.status(404).json({ error: 'User not found or not authenticated with GitHub' });
    }

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

export const getRepoFiles = async (req: AuthRequest, res: Response) => {
  const userId = req.userId; // From JWT
  const repo = req.query.repo as string;

  if (!userId || !repo) {
    return res.status(400).json({ error: 'Missing repo name or user ID from token' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.accessToken || !user.username) {
      return res.status(404).json({ error: 'User not found or not authenticated' });
    }

    // 1. Get repo info to find default branch
    const repoInfo = await axios.get(
      `https://api.github.com/repos/${user.username}/${repo}`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    const defaultBranch = repoInfo.data.default_branch;

    // 2. Get branch info to find commit SHA
    const branchResp = await axios.get(
      `https://api.github.com/repos/${user.username}/${repo}/branches/${defaultBranch}`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );
    const treeSha = branchResp.data.commit.commit.tree.sha;

    // 3. Get the tree using the SHA
    const treeResp = await axios.get(
      `https://api.github.com/repos/${user.username}/${repo}/git/trees/${treeSha}?recursive=1`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );

        const codeExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php',
      '.swift', '.kt', '.kts', '.rs', '.scala', '.dart', '.m', '.mm', '.sh', '.pl', '.r', '.jl',
      '.lua', '.hs', '.fs', '.fsx', '.clj', '.cljs', '.groovy', '.vb', '.vbs', '.ps1', '.sql',
      '.html', '.css', '.json', '.xml', '.yml', '.yaml'
    ];

    const files = treeResp.data.tree
      .filter((item: any) => item.type === 'blob')
      .map((item: any) => item.path)
      .filter((path: string) =>
        codeExtensions.some(ext => path.toLowerCase().endsWith(ext))
      );

    res.json({ files });
  } catch (error: any) {
    console.error('Error fetching files:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

// --- Add this helper at the bottom of the file ---

/**
 * Ensures no double slashes in frontend URL redirection.
 * Usage: safeFrontendUrl("/home") or safeFrontendUrl("/")
 */
function safeFrontendUrl(path: string) {
  let base = process.env.FRONTEND_URL || "";
  // Remove trailing slash from base if present
  if (base.endsWith("/")) base = base.slice(0, -1);
  // Ensure path starts with a single slash
  if (!path.startsWith("/")) path = "/" + path;
  return base + path;
}
