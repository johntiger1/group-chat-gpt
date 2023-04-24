import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "Replace with OpenAI key",
});
const openai = new OpenAIApi(configuration);

export default async function callGPT35Turbo(prompts) {
  try {
    const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: prompts,
    });
    return await response;
  } catch (error) {
    console.error("Error calling GPT-3.5 Turbo:", error);
    return null;
  }
}