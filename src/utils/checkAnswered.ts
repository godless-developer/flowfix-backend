import { assistant } from "../connectPinecone";

export const checkAnswered = async (answer: string) => {
  const matchPercentage = await assistant.context({ query: answer, topK: 3 });
  if (matchPercentage.snippets.length === 0) {
    return 0;
  } else {
    return matchPercentage.snippets[0].score;
  }
};
