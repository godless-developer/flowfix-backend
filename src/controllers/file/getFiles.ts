import { Request, Response } from 'express';
import { assistant } from '../../connectPinecone';

export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query;
    const files = await assistant.listFiles();

    let result = files.files ?? [];

    if (name && typeof name === 'string') {
      result = result.filter((file) => file.name.includes(name));
    }

    const formattedFiles = files.files!.filter((file) => {
      const metadata = file.metadata as { name: string };
      if (metadata.name) {
        return {
          metadata: file.metadata!,
          id: file.id,
        };
      }
    });

    res.json({ files: formattedFiles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get files' });
  }
};
