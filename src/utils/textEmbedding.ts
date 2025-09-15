import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const textEmbedding = async (texts: string) => {
  const result = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: texts,
    dimensions: 1024,
  });

  return result.data[0].embedding;
};
//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
