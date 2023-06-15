
import { ApiConfiguration } from "@/types";
import { Configuration, OpenAIApi } from "openai";

const api = async ({userMessage, apiKey, predefinedMessage}: ApiConfiguration) => {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  
  const openai = new OpenAIApi(configuration);

  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: predefinedMessage + userMessage }],
  });

  return chat_completion
}

export {api}
