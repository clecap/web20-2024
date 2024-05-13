import { ChatGptMailHelper } from "./chatgpt/chatgpt-mail.helper";
import { IChatGptMailHelper } from "./chatgpt/ichatgpt-mail.helper";
import { WritingTone, AddresseeTone } from "./chatgpt/models/reply-tone";
import { TypeOfDetail } from "./chatgpt/models/type-of-detail";

declare const messenger: any;

const helper: IChatGptMailHelper = new ChatGptMailHelper();

/*
  --------------------------------------------
  ! E-MAIL REPLY FUNCTIONALITY STARTS HERE !
  --------------------------------------------
*/

let selectedWritingTone: string = "";
let selectedAddresseTone: string = "";
let selectedIntention: string = "";

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

addresseeToneContainer.addEventListener("click", (_e: Event) => {
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

let possibleIntentions: string[] = [];

possibleIntentions = await helper
  .generatePossibleReplyIntentions(text)
  .then((res) => {
    return res;
  })
  .catch((error) => {
    console.log(error);

    return [];
  })
  .finally(() => {
    let iconSpinner = document.getElementById("ResponseIntentionSpinner");
    iconSpinner.classList.toggle("hidden");
    let iconDefault = document.getElementById("ResponseIntentionIcon");
    iconDefault.classList.toggle("hidden");
  });

let responseIntentionContainer: HTMLElement = document.getElementById(
  "ResponseIntentionContainer"
);
responseIntentionContainer.addEventListener("click", (_e: Event) => {
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

// this user
let nameInput: HTMLInputElement = document.getElementById(
  "NameInput"
) as HTMLInputElement;
let accountId = message.folder.accountId;
let user: string = (await messenger.accounts.get(accountId, false))
  .identities[0].name;
nameInput.value = user;

// generate button functionality
let generate: HTMLButtonElement = document.getElementById(
  "generate"
) as HTMLButtonElement;
generate.addEventListener("click", async (_e: MouseEvent) => {
  let preview: HTMLTextAreaElement = document.getElementById(
    "preview"
  ) as HTMLTextAreaElement;
  if (nameInput.value !== "") user = nameInput.value;
  preview.value = "Loading...";

  try {
    let reply: string = await helper.generateEmailReply(
      text,
      selectedIntention,
      user,
      selectedWritingTone,
      selectedAddresseTone
    );

    if (reply === "" || reply === null) {
      preview.value = "No reply generated. Please try again.";
      return;
    }

    preview.value = reply;
  } catch (error) {
    console.log(error);
    preview.value = "An error occurred. Please try again.";
  }
});

// copy to clipboard button functionality
let copy: HTMLButtonElement = document.getElementById(
  "CopyToClipboardBtn"
) as HTMLButtonElement;
copy.addEventListener("click", async (_e: MouseEvent) => {
  let preview: HTMLTextAreaElement = document.getElementById(
    "preview"
  ) as HTMLTextAreaElement;
  navigator.clipboard.writeText(preview.value);
});

// choose button functionality
let choose: HTMLButtonElement = document.getElementById(
  "choose"
) as HTMLButtonElement;
choose.addEventListener("click", async (_e: MouseEvent) => {
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

let summaryLength: string = ""; // will be: Short | Long

let openSummaryButton: HTMLElement = document.getElementById("SummaryControl");
// let openSummaryButton: HTMLButtonElement = document.getElementById(
//   "SummaryControl"
// ) as HTMLButtonElement;
openSummaryButton.addEventListener("click", async (_e: MouseEvent) => {
  let summaryContainer: HTMLElement =
    document.getElementById("SummaryGenerator");
  summaryContainer.classList.toggle("hidden");
  let replyContainer: HTMLElement = document.getElementById("ReplyGenerator");
  replyContainer.classList.toggle("hidden");
  let replyGeneratorOutputContainer: HTMLElement = document.getElementById(
    "ReplyGeneratorOutput"
  );
  replyGeneratorOutputContainer.classList.toggle("hidden");
  let summaryGeneratorOutputContainer: HTMLElement = document.getElementById(
    "SummaryGeneratorOutput"
  );
  summaryGeneratorOutputContainer.classList.toggle("hidden");

  let summaryButtonIcon: HTMLElement =
    document.getElementById("SummaryControlIcon");
  summaryButtonIcon.classList.toggle("fa-arrow-right");
  summaryButtonIcon.classList.toggle("fa-arrow-left");
  // summaryButtonIcon.classList.toggle("fa-solid");
  // summaryButtonIcon.classList.toggle("fa-regular");

  let openSummaryButtonText = document.getElementById("SummaryControlText");
  openSummaryButtonText.innerText =
    openSummaryButtonText.innerText === "Summary Tool"
      ? "Hide Summary Tool"
      : "Summary Tool";
});

let summaryLengthContainer: HTMLElement = document.getElementById(
  "SummaryLengthContainer"
);
summaryLengthContainer.addEventListener("click", (_e: Event) => {
  let dropdownMenuBox: HTMLElement = document.getElementById(
    "SummaryLengthDropDown"
  );
  dropdownMenuBox.classList.toggle("hidden");
});
// add event listener to each summary length option
let summaryLengthList: HTMLElement =
  document.getElementById("SummaryLengthList");
Object.entries(TypeOfDetail).map(([k, __], _) => {
  let li: HTMLLIElement = document.createElement("li");
  li.className = "menu-option";
  li.textContent = k;
  summaryLengthList.append(li);

  li.addEventListener("click", (e: Event) => {
    if (e.target instanceof HTMLLIElement) {
      summaryLength = e.target.textContent;
      let summaryLengthStatusText: HTMLElement = document.getElementById(
        "SummaryLengthStatusText"
      );
      summaryLengthStatusText.textContent = summaryLength;
    }
  });
});

//summary button functionality
let summaryGeneratorButton: HTMLButtonElement = document.getElementById(
  "SummaryGeneratorButton"
) as HTMLButtonElement;
summaryGeneratorButton.addEventListener("click", async (_e: MouseEvent) => {
  let summaryIcon = document.getElementById("SummaryGeneratorIcon");
  summaryIcon.classList.toggle("icon-spinner");
  let summaryTextView = document.getElementById("SummaryView");

  try {
    summaryTextView.innerText = await helper.generateEmailSummary(
      text,
      summaryLength
    );
  } catch (error) {
    console.log(error);
    summaryTextView.innerText = "An error occurred. Please try again.";
  }

  summaryIcon.classList.toggle("icon-spinner");
});

/*
  ----------------------
  ! HELPER FUNCTIONS !
  ----------------------
*/

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
