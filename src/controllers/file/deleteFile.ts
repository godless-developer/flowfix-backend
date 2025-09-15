import { Request, Response } from "express";
import { assistant } from "../../connectPinecone";

export const deleteFile = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error("File id is required");
    }

    await assistant.deleteFile(id);

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    throw new Error("Internal server error while deleting file");
  }
};
