import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFileContent = async (req: Request, res: Response) => {
  const { userId, repo, filePath } = req.query;

  if (!userId || !repo || !filePath) {
    return res.status(400).json({ error: 'Missing userId, repo, or filePath in query' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId as string } });

    if (!user || !user.accessToken) {
      return res.status(404).json({ error: 'User not found or not authenticated' });
    }

    const githubUsername = user.username;

    const contentResponse = await axios.get(
      `https://api.github.com/repos/${githubUsername}/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    const fileData = contentResponse.data;

    // Decode base64 content
    const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8');

    res.json({ filePath, fileContent });
  } catch (error: any) {
    console.error('Error fetching file content:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch file content from GitHub' });
  }
};
