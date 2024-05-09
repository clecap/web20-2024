export interface IChatGptMailHelper {
  generateEmailReply(
    email: string,
    intention: string,
    name: string,
    writingTone: string,
    addresseeTone: string
  ): Promise<string>;

  generatePossibleReplyIntentions(email: string): Promise<string[]>;

  generateEmailSummary(email: string, typeOfDetail: string): Promise<string>;
}
