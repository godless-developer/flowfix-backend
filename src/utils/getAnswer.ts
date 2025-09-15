import { checkAnswered, checkOwnerInfo, updateTotalQuestion } from '.';
import { assistant } from '../connectPinecone';
import { addQuestion } from '../controllers/message/addQuestion';
import { QuestionModel, TotalQuestionModel } from '../models';
import dotenv from 'dotenv';
dotenv.config();

export const getAnswer = async (message: string, userInfo: string) => {
  const isOwner = await checkOwnerInfo(userInfo, message);

  if (isOwner === 'OTHER') {
    return 'Бид бусад ажилтны мэдээллийг өгөх боломжгүй. Өөрийн мэдээллүүд болон байгууллагын талаарх асуултуудад нээлттэй хариулах болно.';
  }

  const chatResp = await assistant.chat({
    messages: [
      {
        role: 'user',

        content: `${userInfo} ${message} хариулахдаа html <body>, <br>, <ul>, <br><br>, <li>, <ol>, <strong> tag ууд ашиглан уншихад таатай болгон хариулна уу.`,
      },
    ],
    model: 'gpt-4o',
    temperature: 0.6,
  });

  // const chatResp = await assistant.chat({
  //   messages: [{ role: 'user', content: `${userInfo} ${message}` }],
  //   model: 'gpt-4o',
  //   temperature: 0.6,
  // });

  if (!chatResp.message?.content) {
    return '';
  }

  const answerScore = await checkAnswered(chatResp.message.content);

  const citations = chatResp.citations ?? [];
  const references = citations[0]?.references ?? [];

  console.log(citations);

  if (answerScore <= 0.4 && isOwner !== 'HELLO') {
    const added = await addQuestion({
      question: message,
      score: answerScore,
    });

    if (added) {
      const files =
        references.map((ref) => ref.file?.name).filter(Boolean) || [];

      await QuestionModel.create({
        question_text: message,
        score: answerScore,
        existing_files: files,
      });
    }
  }
  for (const ref of references) {
    const metadata = ref.file?.metadata as { name: string };
    if (!metadata?.name) continue;

    const totalQuestion = await TotalQuestionModel.findById(
      process.env.TOTAL_QUESTION_ID
    );

    if (!totalQuestion) continue;

    const topic = totalQuestion.topics.find(
      (t) => t.fileName === metadata.name
    );

    if (topic) {
      topic.amount++;
    } else {
      totalQuestion.topics.push({ fileName: metadata.name, amount: 1 });
    }

    await totalQuestion.save();
  }

  await updateTotalQuestion();

  return chatResp.message.content;
};
