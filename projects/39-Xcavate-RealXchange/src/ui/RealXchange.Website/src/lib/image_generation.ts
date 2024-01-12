'use server';

import OpenAI from 'openai';

// export default async function generateImages({
//   keyword,
//   colour,
//   phrase,
//   numberOfImages
// }: {
//   keyword: string;
//   colour: string;
//   phrase: string;
//   numberOfImages: number;
// }) {
//   const openai = new OpenAI({
//     apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//     dangerouslyAllowBrowser: true
//   });
//   try {
//     const apiCalls = Array.from({ length: numberOfImages }, () => {
//       return openai.images.generate({
//         prompt: `Generate an image based on the following phrase: "${phrase}". Use the following keyword as an anchor: ${keyword}. The image should have a main colour of: ${colour}.`,
//         n: 1,
//         model: 'dall-e-3'
//       });
//     });
//     const results = await Promise.all(apiCalls);
//     console.log(results);
//     return results;
//   } catch (e) {
//     console.log(e);
//   }
// }

interface ImagePrompt {
  keyword: string;
  color: string;
  supply?: string;
  price?: string;
  description: string;
}

export default async function generateImages(imagePrompts: ImagePrompt[]) {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
  try {
    const apiCalls = imagePrompts.map(prompt => {
      return openai.images.generate({
        prompt: `Generate an image based on the following phrase: "${prompt.description}". Use the following keyword as an anchor: ${prompt.keyword}. The image should have a main colour of: ${prompt.color}.`,
        n: 1,
        model: 'dall-e-3'
      });
    });

    const results = await Promise.all(apiCalls);
    console.log({ results });
    return results;
  } catch (e) {
    console.log(e);
  }
}
