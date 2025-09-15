import { index } from "../../connectPinecone";
import { textEmbedding } from "../../utils/textEmbedding";
import { v4 as uuidv4 } from "uuid";

export const addQuestion = async (input: {
  question: string;
  score: number;
}) => {
  const { question, score } = input;
  const embedding = await textEmbedding(question);

  const search = await index.query({
    vector: embedding,
    topK: 1,
    includeMetadata: true,
  });

  const match = search.matches?.[0];

  if (match && match.score! > 0.7) {
    return false;
  }
  const id = uuidv4();
  const questionEmbeded = await textEmbedding(question);
  await index.upsert([
    {
      id: id,
      values: questionEmbeded,
      metadata: {
        score: score,
        status: "unanswered",
        question,
      },
    },
  ]);
  return true;
};
