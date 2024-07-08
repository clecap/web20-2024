export interface IChatGptMailHelper {
  generateEmailReply(
    email: string,
    intention: string,
    name: string,
    writingTone: string,
    urgencyTone: string,
    apiKey: string
  ): Promise<string>;

  generatePossibleReplyIntentions(
    email: string,
    apiKey: string
  ): Promise<string[]>;

  generateEmailSummary(
    email: string,
    typeOfDetail: string,
    apiKey: string
  ): Promise<string>;

  testApiKey(apiKey: string, test: string): Promise<string>;
}
