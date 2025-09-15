import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

export const assistant = pinecone.Assistant("assistant");

export const index = pinecone.index("unanswered-questions");

//pcsk_SZp3h_NQxceA1fAF1AJhkgLQcQFUjc7oEoWk1HPyj4NvBUXob2YUCiMgPry7iKZLrcZk1
