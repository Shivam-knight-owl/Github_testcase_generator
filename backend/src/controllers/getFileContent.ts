import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getFileContent = async (req: AuthRequest, res: Response) => {
  const { repo, filePath } = req.query;
  if (!repo || !filePath) {
    return res.status(400).json({ error: 'Missing repo or filePath in query' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.accessToken) {
      return res.status(404).json({ error: 'User not found or not authenticated' });
    }

    const contentResponse = await axios.get(
      `https://api.github.com/repos/${user.username}/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );

    const fileData = contentResponse.data;
    const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8');

    res.json({ filePath, fileContent });
  } catch (error: any) {
    console.error('Error fetching file content:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch file content from GitHub' });
  }
};
