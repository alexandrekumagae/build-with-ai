import 'dotenv/config';

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

import chalk from 'chalk';

import fs from "node:fs";

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

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {
  const image = fileToGenerativePart("img/cronograma.webp", "image/webp")
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision', generationConfig, safetySettings });

  const prompt = "Me liste todos os eventos que ocorrerão nesse dia.";
  
  const result = await model.generateContent([prompt, image]);
  const response = await result.response;
  const text = response.text();
  console.log(chalk.bgBlue(text))
}

run();