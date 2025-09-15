import { Request, Response } from "express";
import { index } from "../../connectPinecone";

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    if (!id) {
      throw new Error("Message id required");
    }

    await index.deleteMany([id]);
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    throw new Error("Failed to delete message");
  }
};
