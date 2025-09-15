import express from 'express';
import multer from 'multer';
import { uploadFile, deleteFile, getFiles } from '../controllers/file';

export const fileRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

fileRouter.post('/api/upload', upload.single('file'), uploadFile);

fileRouter.delete('/', deleteFile);

fileRouter.get('/', getFiles);
