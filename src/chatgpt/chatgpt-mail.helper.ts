import { ChatGptSession } from "./chatgpt-session";
import { IChatGptMailHelper } from "./ichatgpt-mail.helper";

export class ChatGptMailHelper implements IChatGptMailHelper {
  async generateEmailReply(
    email: string,
    intention: string,
    name: string,
    writingTone: string,
    urgencyTone: string,
    apiKey: string
  ): Promise<string> {
    const session = new ChatGptSession([], apiKey);
    let templatesString = localStorage.getItem("templates");
    let emailGenerationPrompt = "";
    type Template = {
      q: string; // question
      a: string; // answer
    };
    urgencyTone = urgencyTone === "" ? "neutral" : urgencyTone;
    writingTone = writingTone === "" ? "neutral" : writingTone;

    if (templatesString === "") {
      emailGenerationPrompt = `Based on the following Email correspondance, generate a response email with the intention "${intention.valueOf()}" using a ${writingTone} tone and ${urgencyTone} urgency.
      Respond just with the content of the email. The senders name is ${name}. Reply in the language used in the given emails. Add "This E-Mail was written with the help of ChatGPT." at the end of the email. E-Mail:`;
    } else {
      let templates: Template[] = [];
      templates = JSON.parse(templatesString);
      let QAString = "";
      templates.forEach((template, index) => {
        QAString = QAString + `Question: ${template.q}? Answer: ${template.a};`;
      });
      emailGenerationPrompt = `Based on the following Email correspondance, generate a response email with the intention "${intention.valueOf()}" using a ${writingTone} tone and ${urgencyTone} urgency.
      Respond just with the content of the email. The senders name is ${name}. Reply in the language used in the given emails. Add "This E-Mail was written with the help of ChatGPT." at the end of the email.
      Use the following questions and answers as overall information on the sender and their context: ${QAString}. E-Mail:`;
    }
    return await session.sendMessage(`${emailGenerationPrompt}\n\n${email}`);
  }

  async generateEmailSummary(
    email: string,
    typeOfDetail: string,
    apiKey: string
  ): Promise<string> {
    const session = new ChatGptSession([], apiKey);

    let summarizationPrompt = "";
    if (typeOfDetail.toLowerCase() === "short") {
      summarizationPrompt = `Summarize the following Email content in a short manner. Tell me if this E-Mail is a spam by writing "SPAM" at the beginning.
       Provide the key points. Ensure to use the language of the email.`;
    } else if (typeOfDetail.toLowerCase() === "long") {
      summarizationPrompt = `Summarize the following Email content in a long manner. Tell me if this E-Mail is a spam by writing "SPAM" at the beginning.
       If the E-Mail includes event details, highlight important dates and time. Provide all the important details. Ensure to use the language of the email.`;
    } else {
      summarizationPrompt = `Summarize the following Email content in a short manner. Tell me if this E-Mail is a spam by writing "SPAM" at the beginning.
       Provide the key points. Ensure to use the language of the email.`;
    }

    return await session.sendMessage(`${summarizationPrompt}\n\n${email}`);
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

  async testApiKey(apiKey: string, test: string): Promise<string> {
    const session = new ChatGptSession([], apiKey);

    return await session.sendMessage(test);
  }
}
