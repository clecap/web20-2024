import { ChatGptSession } from "./chatgpt-session";
import { IChatGptMailHelper } from "./ichatgpt-mail.helper";

export class ChatGptMailHelper implements IChatGptMailHelper {
  async generateEmailReply(
    email: string,
    intention: string,
    name: string,
    writingTone: string,
    addresseeTone: string,
    apiKey: string
  ): Promise<string> {
    const session = new ChatGptSession([], apiKey);

    return await session.sendMessage(
      `Based on the following Email correspondance, please generate a response email with the intention "${intention.valueOf()}" using a ${writingTone} tone and addressing a ${addresseeTone} recipient.
      Respond just with the content of the email. The senders name is ${name}. Reply in the language used in the given emails.\n\n${email}`
    );
  }

  async generateEmailSummary(
    email: string,
    typeOfDetail: string,
    apiKey: string
  ): Promise<string> {
    const session = new ChatGptSession([], apiKey);

    return await session.sendMessage(
      `Summarize the following Email content in a ${typeOfDetail.valueOf()} manner.`
    );
  }

  async generatePossibleReplyIntentions(
    email: string,
    apiKey: string
  ): Promise<string[]> {
    const session = new ChatGptSession([], apiKey);

    const reply = await session.sendMessage(
      `Based on the following Email correspondance, please generate a list of a maximum of five possible intentions for replying to the email.
      Respond with a List of short keywords, seperated by a ";". For example: "Confirm Attendance;Decline Attendance".\n\n${email}`
    );

    return reply.split(";");
  }

  async testApiKey( 
    apiKey: string,
    test: string,
  ): Promise<string> {
    const session = new ChatGptSession([], apiKey);

    return await session.sendMessage(
     test
    );

  }
}
