import { ChatGptSession } from './chatgpt-session';
import { IChatGptMailHelper } from './ichatgpt-mail.helper';
import { ReplyTone } from './models/reply-tone';

export class ChatGptMailHelper implements IChatGptMailHelper {
  async generateEmailReply(
    email: string,
    intention: string,
    name: string,
    tone: ReplyTone
  ): Promise<string> {
    const session = new ChatGptSession([]);

    return await session.sendMessage(
      `Based on the following Email correspondance, please generate a response email with the intention "${intention.valueOf()}" using a ${tone.valueOf()} tone. 
      Respond just with the content of the email. The senders name is ${name}. Reply in the language used in the given emails.\n\n${email}`
    );
  }

  async generateEmailSummary(email: string, typeOfDetail: string): Promise<string> {
    const session = new ChatGptSession([]);
    
    return await session.sendMessage(
      `Summarize the following Email content in a ${typeOfDetail.valueOf()} manner.`
    );
  }

  async generatePossibleReplyIntentions(email: string): Promise<string[]> {
    const session = new ChatGptSession([]);

    const reply = await session.sendMessage(
      `Based on the following Email correspondance, please generate a list of a maximum of five possible intentions for replying to the email. 
      Respond with a List of short keywords, seperated by a ";". For example: "Confirm Attendance;Decline Attendance".\n\n${email}`
    );

    return reply.split(';');
  }
}
