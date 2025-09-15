import { assistant } from '../connectPinecone';
import { emptyFolder } from './emptyFolder';
import fs from 'fs/promises';

export const fileUploadToPinecone = async (
  path: string,
  text: string,
  size?: string,
  name?: string
) => {
  try {
    await fs.writeFile(path, text, 'utf-8');

    const uploadedFile = await assistant.uploadFile({
      path: path,
      metadata: {
        size: size || '',
        name: name || '',
      },
    });

    emptyFolder('uploads');
    return uploadedFile;
  } catch (error) {
    throw new Error('Файл оруулахад алдаа гарлаа.');
  }
};
