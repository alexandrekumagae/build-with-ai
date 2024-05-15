import 'dotenv/config';

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

import chalk from 'chalk';

const key = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(key);

const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 200,
  temperature: 0.5,
  topP: 0.1,
  topK: 16,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

async function run() {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro', generationConfig, safetySettings });

  const prompt = "Me conte uma piada.";
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(chalk.bgBlue(text))
}

run();