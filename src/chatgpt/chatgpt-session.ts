import OpenAI from "openai";
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources";

export class ChatGptSession {
  private apiKey: string = "";
  private openai: OpenAI;

  public messageHistory: ChatCompletionMessageParam[] = [];

  constructor(
    initialMessages: ChatCompletionMessageParam[],
    apiKey: string,
    private model: string = "gpt-3.5-turbo"
  ) {
    // this.configuration.apiKey = apiKey;
    // console.log(this.configuration.apiKey);

    this.openai = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });

    this.messageHistory = initialMessages;
  }

  public async sendMessage(
    message: string,
    temperature: number = 0.2
  ): Promise<string> {
    this.messageHistory.push(this.createUserRequestMessage(message));

    const request: ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      messages: this.messageHistory,
      temperature,
    };

    try {
      const completion = await this.openai.chat.completions.create(request);

      if (completion.choices.length > 0) {
        const response = completion.choices[0].message;

        this.messageHistory.push(response);

        console.log("Response from OpenAI:", response);

        return response.content;
      }
    } catch (error: any) {
      console.log(error.message);

      console.error("An error occured while calling the OpenAI API.", error);
      throw error;
    }
  }

  private createUserRequestMessage(
    message: string
  ): ChatCompletionMessageParam {
    return {
      role: "user",
      content: message,
    };
  }
}
