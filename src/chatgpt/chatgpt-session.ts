import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
// import { API_KEY } from './api-key.const';

export class ChatGptSession {
  private configuration = new Configuration({
    apiKey: "",
  });
  private openai: OpenAIApi;

  public messageHistory: ChatCompletionRequestMessage[] = [];

  constructor(
    initialMessages: ChatCompletionRequestMessage[],
    apiKey: string,
    private model: string = "gpt-3.5-turbo"
  ) {
    this.configuration.apiKey = apiKey;
    this.openai = new OpenAIApi(this.configuration);

    this.messageHistory = initialMessages;
  }

  public async sendMessage(
    message: string,
    temperature: number = 0.2
  ): Promise<string> {
    this.messageHistory.push(this.createUserRequestMessage(message));

    const request: CreateChatCompletionRequest = {
      model: this.model,
      messages: this.messageHistory,
      temperature,
    };

    try {
      const completion = await this.openai.createChatCompletion(request);

      if (completion.data.choices.length > 0) {
        const response = completion.data.choices[0].message;

        this.messageHistory.push(response);

        console.log("Response from OpenAI:", response);

        return response.content;
      }
    } catch (error: unknown) {
      console.error("An error occured while calling the OpenAI API.", error);
      throw error;
    }
  }

  private createUserRequestMessage(
    message: string
  ): ChatCompletionRequestMessage {
    return {
      role: "user",
      content: message,
    };
  }
}
