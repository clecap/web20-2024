import { ReplyTone } from './models/reply-tone';

export interface IChatGptMailHelper {
  generateEmailReply(
    email: string,
    intention: string,
    name: string,
    tone: ReplyTone
  ): Promise<string>;

  generatePossibleReplyIntentions(email: string): Promise<string[]>;
}
