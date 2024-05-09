import { ChatGptMailHelper } from "./chatgpt/chatgpt-mail.helper";
import { IChatGptMailHelper } from "./chatgpt/ichatgpt-mail.helper";
import { WritingTone, AddresseeTone } from "./chatgpt/models/reply-tone";
import { TypeOfDetail } from "./chatgpt/models/type-of-detail";

declare const messenger: any;

const helper: IChatGptMailHelper = new ChatGptMailHelper();

let selectedWritingTone = "";
let selectedAddresseTone = "";
let selectedIntention = "";

// populate writing tone dropdown
let writingToneContainer: HTMLElement = document.getElementById(
  "WritingToneContainer"
);
writingToneContainer.addEventListener("click", (e: Event) => {
  let dropdownMenuBox: HTMLElement = document.getElementById(
    "WritingToneDropDown"
  );
  dropdownMenuBox.classList.toggle("hidden");
});
let writingToneList: HTMLElement = document.getElementById("WritingToneList");
Object.entries(WritingTone).map(([k, __], _) => {
  let li: HTMLLIElement = document.createElement("li");
  li.className = "menu-option";
  li.textContent = k;
  writingToneList.append(li);
});
writingToneList.addEventListener("click", (e: Event) => {
  if (e.target instanceof HTMLLIElement) {
    selectedWritingTone = e.target.textContent;
    let writingToneStatusText: HTMLElement = document.getElementById(
      "WritingToneStatusText"
    );
    writingToneStatusText.textContent = selectedWritingTone;
  }
});

// populate addressee tone dropdown
let addresseeToneContainer: HTMLElement = document.getElementById(
  "AddresseeToneContainer"
);

addresseeToneContainer.addEventListener("click", (e: Event) => {
  let dropdownMenuBox: HTMLElement = document.getElementById(
    "AddresseeToneDropDown"
  );
  dropdownMenuBox.classList.toggle("hidden");
});
let addreseeToneList: HTMLElement =
  document.getElementById("AddresseeToneList");
Object.entries(AddresseeTone).map(([k, __], _) => {
  let li: HTMLLIElement = document.createElement("li");
  li.className = "menu-option";
  li.textContent = k;
  addreseeToneList.append(li);
});
addreseeToneList.addEventListener("click", (e: Event) => {
  if (e.target instanceof HTMLLIElement) {
    selectedAddresseTone = e.target.textContent;
    let addresseeToneStatusText: HTMLElement = document.getElementById(
      "AddresseeToneStatusText"
    );
    addresseeToneStatusText.textContent = selectedAddresseTone;
  }
});

// read email
let tabs = await messenger.tabs.query({ active: true, currentWindow: true });
let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id);
let full = await messenger.messages.getFull(message.id);

let subject: string = message.subject;
let author: string = message.author;
let text: string = getText(full);

// let possibleIntentions = await helper
//   .generatePossibleReplyIntentions(text)
//   .then((res) => {
//     if (res.length === 0) {
//       console.log("No intentions found");
//     }

//     let iconSpinner = document.getElementById("ResponseIntentionSpinner");
//     iconSpinner.classList.toggle("hidden");
//     let iconDefault = document.getElementById("ResponseIntentionIcon");
//     iconDefault.classList.toggle("hidden");

//     return res;
//   });

const possibleIntentions = "Confirm Attendance;Decline Attendance".split(";");

let responseIntentionContainer: HTMLElement = document.getElementById(
  "ResponseIntentionContainer"
);
responseIntentionContainer.addEventListener("click", (e: Event) => {
  let dropdownMenuBox: HTMLElement = document.getElementById(
    "ResponseIntentionDropDown"
  );
  dropdownMenuBox.classList.toggle("hidden");
});
let responseIntentionList: HTMLElement = document.getElementById(
  "ResponseIntentionList"
);
for (const [index, intention] of possibleIntentions.entries()) {
  let li: HTMLLIElement = document.createElement("li");
  li.className = "menu-option";
  li.textContent = intention;
  li.value = index;
  responseIntentionList.append(li);
}
responseIntentionList.addEventListener("click", (e: Event) => {
  if (e.target instanceof HTMLLIElement) {
    selectedIntention = e.target.textContent;
    let responseIntentionStatusText: HTMLElement = document.getElementById(
      "ResponseIntentionStatusText"
    );
    responseIntentionStatusText.textContent = selectedIntention;
  }
});

// fill typeOfDetail drop down
// let type_of_detail: HTMLSelectElement = document.getElementById(
//   "type_of_detail"
// ) as HTMLSelectElement;
// Object.entries(TypeOfDetail).map(([k, __], _) => {
//   let opt: HTMLOptionElement = document.createElement("option");
//   opt.value = k;
//   opt.innerHTML = k;
//   type_of_detail.append(opt);
// });

// this user
let nameinput: HTMLInputElement = document.getElementById(
  "NameInput"
) as HTMLInputElement;
let accountId = message.folder.accountId;
let user: string = (await messenger.accounts.get(accountId, false))
  .identities[0].name;
nameinput.value = user;

// generate button functionality
let generate: HTMLButtonElement = document.getElementById(
  "generate"
) as HTMLButtonElement;
generate.addEventListener("click", async (e: MouseEvent) => {
  let preview: HTMLTextAreaElement = document.getElementById(
    "preview"
  ) as HTMLTextAreaElement;
  if (nameinput.value !== "") user = nameinput.value;
  preview.value = "Loading...";

  let reply: string = await helper.generateEmailReply(
    text,
    selectedIntention,
    user,
    selectedWritingTone,
    selectedAddresseTone
  );
  preview.value = reply;
});

// copy to clipboard button functionality
let copy: HTMLButtonElement = document.getElementById(
  "CopyToClipboardBtn"
) as HTMLButtonElement;
copy.addEventListener("click", async (e: MouseEvent) => {
  let preview: HTMLTextAreaElement = document.getElementById(
    "preview"
  ) as HTMLTextAreaElement;
  navigator.clipboard.writeText(preview.value);
});

// choose button functionality
let choose: HTMLButtonElement = document.getElementById(
  "choose"
) as HTMLButtonElement;
choose.addEventListener("click", async (e: MouseEvent) => {
  let preview: HTMLTextAreaElement = document.getElementById(
    "preview"
  ) as HTMLTextAreaElement;
  let reply: string = preview.value;
  let compose_details = {
    plainTextBody: reply,
    subject: "Re: " + subject,
    type: "reply",
    to: author,
  };
  await messenger.compose.beginReply(
    message.id,
    "replyToSender",
    compose_details
  );
});

/*
  -------------------------------------
  ! SUMMARY FUNCTIONALITY STARTS HERE !
  -------------------------------------
*/

let openSummaryButton: HTMLButtonElement = document.getElementById(
  "SummaryControl"
) as HTMLButtonElement;
openSummaryButton.addEventListener("click", async (e: MouseEvent) => {
  let summaryContainer: HTMLElement = document.getElementById(
    "SummaryGeneratorContainer"
  );
  summaryContainer.classList.toggle("hidden");

  let replyGeneratorContainer: HTMLElement = document.getElementById(
    "ReplyGeneratorContainer"
  );
  replyGeneratorContainer.classList.add("hidden");
});

//summary button functionality
let summary: HTMLButtonElement = document.getElementById(
  "summary"
) as HTMLButtonElement;
summary.addEventListener("click", async (e: MouseEvent) => {
  let summary_text_field: HTMLTextAreaElement = document.getElementById(
    "summary_text_field"
  ) as HTMLTextAreaElement;
  // let opt: HTMLOptionElement =
  //   intentions_drop_down.options[intentions_drop_down.selectedIndex];
  // let typeofDetail: string = opt.value;

  summary.value =
    "Press summarize content button to see a summary of your email";
  // summary_text_field.value = await helper.generateEmailSummary(
  //   text,
  //   typeofDetail
  // );
});

function getText(element: any): string {
  // search for part that has contenttype "text/*"
  element = recursiveSearch(element, "text");
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
  var span = document.createElement("span");
  span.innerHTML = s;
  return span.innerText || span.textContent;
}
