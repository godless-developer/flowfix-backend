import { Request, Response } from 'express';
import fs from 'fs/promises';
import { assistant } from '../../connectPinecone';
import { convertToTxt, emptyFolder } from '../../utils';
import { fileUploadToPinecone } from '../../utils/fileUploadToPinecone';

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file || !req.file.path) {
      res.status(400).json({ error: 'Missing file path' });
      return;
    }

    const text = await convertToTxt({
      input: { filePath: req.file.path, fileName: req.body.name },
    });

    const txtPath = `uploads/${req.body.name.split('.')[0]}.txt`;

    const uploadedFile = await fileUploadToPinecone(
      txtPath,
      text,
      req.body.size,
      req.body.name
    );
    res.status(200).json({ success: true, uploadedFile: uploadedFile });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: `Файл оруулахад алдаа гарлаа. : ${err}`,
    });
  }
};
