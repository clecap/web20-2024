import { ChatGptMailHelper } from './chatgpt/chatgpt-mail.helper';
import { IChatGptMailHelper } from './chatgpt/ichatgpt-mail.helper';
import { ReplyTone } from './chatgpt/models/reply-tone';
import { TypeOfDetail } from './chatgpt/models/type-of-detail';

declare const messenger: any;

const helper: IChatGptMailHelper = new ChatGptMailHelper();

console.log('popup.ts loaded');

// fill tone drop down
let tone_drop_down: HTMLSelectElement = document.getElementById('tones') as HTMLSelectElement;
Object.entries(ReplyTone).map(([k, __], _) => {
  let opt: HTMLOptionElement = document.createElement('option');
  opt.value = k;
  opt.innerHTML = k;
  tone_drop_down.append(opt);
});

// read email
let tabs = await messenger.tabs.query({ active: true, currentWindow: true });
let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id);
let full = await messenger.messages.getFull(message.id);

let subject: string = message.subject;
let author: string = message.author;
let text: string = getText(full);

// fill intentions drop down
let intentions_drop_down: HTMLSelectElement = document.getElementById(
  'intentions'
) as HTMLSelectElement;
intentions_drop_down.textContent = 'Loading...';
let loadingOpt: HTMLOptionElement = document.createElement('option');
loadingOpt.innerHTML = 'Loading...';
loadingOpt.selected = true;
loadingOpt.disabled = true;
intentions_drop_down.append(loadingOpt);
intentions_drop_down.disabled = true;

// fill typeOfDetail drop down
let type_of_detail: HTMLSelectElement = document.getElementById('type_of_detail') as HTMLSelectElement;
Object.entries(TypeOfDetail).map(([k, __], _) => {
  let opt: HTMLOptionElement = document.createElement('option');
  opt.value = k;
  opt.innerHTML = k;
  type_of_detail.append(opt);
});

const possibleIntentions = await helper.generatePossibleReplyIntentions(text);

for (const intention of possibleIntentions) {
  let opt: HTMLOptionElement = document.createElement('option');
  opt.value = intention;
  opt.innerHTML = intention;
  intentions_drop_down.append(opt);
}
intentions_drop_down.disabled = false;
loadingOpt.innerHTML = 'Choose...';

// this user
let accountId = message.folder.accountId;
let user: string = (await messenger.accounts.get(accountId, false)).identities[0].name;

// generate button functionality
let generate: HTMLButtonElement = document.getElementById('generate') as HTMLButtonElement;
generate.addEventListener('click', async (e: MouseEvent) => {
  let preview: HTMLTextAreaElement = document.getElementById('preview') as HTMLTextAreaElement;
  let nameinput: HTMLInputElement = document.getElementById('input') as HTMLInputElement;
  if(nameinput.value !== "") user = nameinput.value;
  let opt: HTMLOptionElement = intentions_drop_down.options[intentions_drop_down.selectedIndex];
  let intention: string = opt.value;

  let toneOpt = tone_drop_down.options[tone_drop_down.selectedIndex];
  let tone: ReplyTone = ReplyTone[toneOpt.value as keyof typeof ReplyTone];

  preview.value = "Loading...";

  let reply: string = await helper.generateEmailReply(text, intention, user, tone);
  preview.value = reply;
});

// choose button functionality
let choose: HTMLButtonElement = document.getElementById('choose') as HTMLButtonElement;
choose.addEventListener('click', async (e: MouseEvent) => {
  let preview: HTMLTextAreaElement = document.getElementById('preview') as HTMLTextAreaElement;
  let reply: string = preview.value;
  let compose_details = {
    plainTextBody: reply,
    subject: 'Re: ' + subject,
    type: 'reply',
    to: author,
  };
  await messenger.compose.beginReply(message.id, 'replyToSender', compose_details);
});

//summary button functionality 
let summary: HTMLButtonElement = document.getElementById('summary') as HTMLButtonElement;
summary.addEventListener('click', async (e: MouseEvent) => {
  let summary_text_field: HTMLTextAreaElement = document.getElementById('summary_text_field') as HTMLTextAreaElement;
  let opt: HTMLOptionElement = intentions_drop_down.options[intentions_drop_down.selectedIndex];
  let typeofDetail: string = opt.value;

  summary.value = "Press summarize content button to see a summary of your email"
  summary_text_field.value = await helper.generateEmailSummary(text, typeofDetail)
})


function getText(element: any): string {
  // search for part that has contenttype "text/*"
  element = recursiveSearch(element, 'text');
  // twice because of comments
  return extractContent(extractContent(element.body));
}

function recursiveSearch(element: any, contentType: any): any {
  if (element.contentType.includes(contentType)) {
    return element;
  }
  for (const key in element.parts) {
    if (Object.hasOwnProperty.call(element.parts, key)) {
      const item = element.parts[key];
      const search = recursiveSearch(item, contentType);
      if (search != null) {
        return search;
      }
    }
  }
  return null;
}

function extractContent(s: string): string {
  var span = document.createElement('span');
  span.innerHTML = s;
  return span.innerText || span.textContent;
}
