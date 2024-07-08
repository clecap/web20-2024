import { ChatGptMailHelper } from "./chatgpt/chatgpt-mail.helper";
import { IChatGptMailHelper } from "./chatgpt/ichatgpt-mail.helper";
import { WritingTone, UrgencyTone } from "./chatgpt/models/reply-tone";
import { TypeOfDetail } from "./chatgpt/models/type-of-detail";

declare const messenger: any;
// with correct type:
declare const localStorage: Storage;

const helper: IChatGptMailHelper = new ChatGptMailHelper();

let username: string = "";

/*
  -------------------------------
  ! API KEY FUNCTIONALITY STARTS !
  -------------------------------
*/
// check extension storage for stored API key
let apiKey: string = "";
let summaryGeneratorButton: HTMLButtonElement = document.getElementById(
  "SummaryGeneratorButton"
) as HTMLButtonElement;
let emailGeneratorButton: HTMLButtonElement = document.getElementById(
  "generate"
) as HTMLButtonElement;

const getApiKeyFromStorage: () => Promise<string> = async () => {
  return new Promise((resolve, reject) => {
    let result = localStorage.getItem("apiKey");
    if (result) {
      resolve(result);
    } else {
      reject("No API key found in storage.");
    }
  });
};

await getApiKeyFromStorage()
  .then((res) => {
    if (typeof res === "string") {
      apiKey = res;
    }
  })
  .catch((error) => {
    console.error(error);
  });

let apiKeyInput: HTMLInputElement = document.getElementById(
  "APIKeyInput"
) as HTMLInputElement;
apiKeyInput.value = apiKey;

let successfullySavedTag: HTMLElement = document.getElementById(
  "SuccessfullySavedTag"
);

let negativeSavedTag: HTMLElement = document.getElementById("NegativeSavedTag");

let applySettingsButton: HTMLButtonElement = document.getElementById(
  "ApplySettingsButton"
) as HTMLButtonElement;
applySettingsButton.addEventListener("click", async (_e: MouseEvent) => {
  let apiKeyInput: HTMLInputElement = document.getElementById(
    "APIKeyInput"
  ) as HTMLInputElement;
  apiKey = apiKeyInput.value;
  username = (document.getElementById("NameInput") as HTMLInputElement).value;

  localStorage.setItem("apiKey", apiKey);
  localStorage.setItem("username", username);

  let noTokenErrorText: HTMLElement =
    document.getElementById("NoTokenErrorText");

  if (apiKey !== "") {
    summaryGeneratorButton.removeAttribute("disabled");
    emailGeneratorButton.removeAttribute("disabled");
    summaryGeneratorButton.classList.remove("button-disabled");
    emailGeneratorButton.classList.remove("button-disabled");
    noTokenErrorText.classList.add("hidden");
  } else {
    summaryGeneratorButton.setAttribute("disabled", "true");
    emailGeneratorButton.setAttribute("disabled", "true");
    summaryGeneratorButton.classList.add("button-disabled");
    emailGeneratorButton.classList.add("button-disabled");
    noTokenErrorText.classList.remove("hidden");

    getPossibleIntentions();
  }

  error = await helper
    .testApiKey(apiKey, "0")
    .then((res) => {
      return res.toString() || "";
    })
    .catch((error) => {
      console.error(error);
      negativeSavedTag.classList.remove("hidden");
      return "";
    })
    .finally(() => {
      successfullySavedTag.classList.remove("hidden");
      return "";
    });
});

/*
  ----------------------------------------------
  ! DISABLE ALL BUTTONS IF NO STORED API KEY OR INVALID !
  ----------------------------------------------
*/

if (apiKey === "") {
  summaryGeneratorButton.setAttribute("disabled", "true");
  emailGeneratorButton.setAttribute("disabled", "true");
  summaryGeneratorButton.classList.toggle("button-disabled");
  emailGeneratorButton.classList.toggle("button-disabled");
  let noTokenErrorText: HTMLElement =
    document.getElementById("NoTokenErrorText");
  noTokenErrorText.classList.toggle("hidden");
}

/*
  --------------------------------------------
  ! E-MAIL REPLY FUNCTIONALITY STARTS HERE !
  --------------------------------------------
*/

let selectedWritingTone: string = "";
let selectedUrgencyTone: string = "";
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

// populate urgency tone dropdown
let urgencyToneContainer: HTMLElement = document.getElementById(
  "UrgencyToneContainer"
);

urgencyToneContainer.addEventListener("click", (_e: Event) => {
  let dropdownMenuBox: HTMLElement = document.getElementById(
    "UrgencyToneDropDown"
  );
  dropdownMenuBox.classList.toggle("hidden");
});
let urgencyToneList: HTMLElement = document.getElementById("UrgencyToneList");
Object.entries(UrgencyTone).map(([k, __], _) => {
  let li: HTMLLIElement = document.createElement("li");
  li.className = "menu-option";
  li.textContent = k;
  urgencyToneList.append(li);
});
urgencyToneList.addEventListener("click", (e: Event) => {
  if (e.target instanceof HTMLLIElement) {
    selectedUrgencyTone = e.target.textContent;
    let urgencyToneStatusText: HTMLElement = document.getElementById(
      "UrgencyToneStatusText"
    );
    urgencyToneStatusText.textContent = selectedUrgencyTone;
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

let error: string;

async function getPossibleIntentions(): Promise<void> {
  possibleIntentions = await helper
    .generatePossibleReplyIntentions(text, apiKey)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.error(error);

      return [];
    })
    .finally(() => {
      let iconSpinner = document.getElementById("ResponseIntentionSpinner");
      iconSpinner.classList.toggle("hidden");
      let iconDefault = document.getElementById("ResponseIntentionIcon");
      iconDefault.classList.toggle("hidden");
    });
}

getPossibleIntentions();

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
nameInput.value = "";

const getUserFromStorage: () => Promise<string> = async () => {
  return new Promise((resolve, reject) => {
    let result = localStorage.getItem("username");
    if (result) {
      resolve(result);
    } else {
      reject("No username found in storage.");
    }
  });
};

await getUserFromStorage()
  .then((res) => {
    if (typeof res === "string") {
      username = res;
      nameInput.value = username;
    }
  })
  .catch(async (error) => {
    console.error(error);
    let user: string = (await messenger.accounts.get(accountId, false))
      .identities[0].name;

    nameInput.value = user;
    localStorage.setItem("username", user);
  });

// generate button functionality
emailGeneratorButton.addEventListener("click", async (_e: MouseEvent) => {
  let emailGeneratorIcon = document.getElementById("ReplyGeneratorIcon");
  let preview: HTMLTextAreaElement = document.getElementById(
    "preview"
  ) as HTMLTextAreaElement;
  preview.value = "Loading...";
  emailGeneratorIcon.classList.toggle("fa-spinner");
  emailGeneratorIcon.classList.toggle("icon-spinner");

  try {
    let reply: string = await helper.generateEmailReply(
      text,
      selectedIntention,
      username,
      selectedWritingTone,
      selectedUrgencyTone,
      apiKey
    );

    if (reply === "" || reply === null) {
      preview.value = "No reply generated. Please try again.";
      return;
    }

    preview.value = reply;
  } catch (error) {
    console.error(error);
    preview.value = error.message;
  }

  emailGeneratorIcon.classList.toggle("fa-spinner");
  emailGeneratorIcon.classList.toggle("icon-spinner");
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
  const isOpening: boolean = openSummaryButton.innerText === "Summary Tool";

  let summaryContainer: HTMLElement =
    document.getElementById("SummaryGenerator");
  let generatorContainer = document.getElementById("GeneratorPage");
  let summaryButtonIcon: HTMLElement =
    document.getElementById("SummaryControlIcon");
  let replyGeneratorOutputContainer: HTMLElement = document.getElementById(
    "ReplyGeneratorOutput"
  );
  let summaryGeneratorOutputContainer: HTMLElement = document.getElementById(
    "SummaryGeneratorOutput"
  );
  let generatorContainerDiv: HTMLElement = document.getElementById("generator");

  if (isOpening) {
    replyGeneratorOutputContainer.classList.add("hidden");
  } else {
    replyGeneratorOutputContainer.classList.remove("hidden");
  }
  summaryGeneratorOutputContainer.classList.toggle("hidden");

  summaryContainer.classList.toggle("hidden");
  summaryButtonIcon.classList.toggle("fa-arrow-right");
  summaryButtonIcon.classList.toggle("fa-arrow-left");

  generatorContainer.classList.toggle("hidden");
  document.getElementById("tooltip").classList.add("hidden");
  document.getElementById("template").classList.add("hidden");
  generatorContainerDiv.classList.add("hidden");

  if (!isOpening) {
    document.getElementById("tab-tooltips").classList.remove("page-selected");
    document.getElementById("tab-templates").classList.remove("page-selected");
    document.getElementById("tab-generator").classList.add("page-selected");
    generatorContainerDiv.classList.remove("hidden");
  }

  let openSummaryButtonText = document.getElementById("SummaryControlText");
  openSummaryButtonText.innerText = isOpening
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
summaryGeneratorButton.addEventListener("click", async (_e: MouseEvent) => {
  let summaryIcon = document.getElementById("SummaryGeneratorIcon");
  summaryIcon.classList.toggle("fa-spinner");
  summaryIcon.classList.toggle("icon-spinner");
  let summaryTextView = document.getElementById("SummaryView");

  try {
    summaryTextView.innerText = await helper.generateEmailSummary(
      text,
      summaryLength,
      apiKey
    );
  } catch (error) {
    console.error(error);
    summaryTextView.innerText = error.message;
  }

  summaryIcon.classList.toggle("fa-spinner");
});

/*
  -------------------------------------
  ! TEMPLATE FUNCTIONALITY STARTS HERE !
  -------------------------------------
*/
type Template = {
  q: string; // question
  a: string; // answer
};
// localStorage.setItem("templates", JSON.stringify([]));
let templates: Template[] = [];

//localStorage.templates = JSON.stringify(templates);

const loadTemplates: () => Promise<string> = async () => {
  return new Promise((resolve, reject) => {
    let result = localStorage.getItem("templates");
    if (result) {
      resolve(result);
    } else {
      reject("No templates found in storage.");
    }
  });
};

let templateAddButton: HTMLElement =
  document.getElementById("addTemplateButton");

await loadTemplates()
  .then((result) => {
    if (typeof result === "string") {
      templates = JSON.parse(result);
      displayTemplates();
    }
  })
  .catch((error) => {
    console.error(error);
  });

loadTemplates();

templateAddButton.addEventListener("click", async (_e: MouseEvent) => {
  if (templates.length >= 10) {
    return;
  }

  templates.push({ q: "", a: "" });
  addNew("", "", true, templates.length - 1);
});

displayTemplates();

function displayTemplates() {
  let parent = document.getElementById("templateContainer");
  while (parent.children.length > 1) {
    parent.removeChild(parent.firstChild);
  }

  let templateCounter = document.getElementById("templateCounter");
  templateCounter.textContent = templates.length + " / 10";

  // if templates are 10 disable else enable
  if (templates.length >= 10) {
    templateAddButton.setAttribute("disabled", "true");
    templateAddButton.classList.add("button-disabled");
  } else {
    templateAddButton.removeAttribute("disabled");
    templateAddButton.classList.remove("button-disabled");
  }

  templates.forEach((template, index) => {
    addNew(template.q, template.a, false, index);
  });
}

function addNew(q: string, a: string, isNew: boolean, index: number) {
  let templateObject = document.createElement("div");
  templateObject.className = "template-object";
  templateObject.id = "container-" + index.toString();
  let inputField = document.createElement("div");
  inputField.className = "template-input-group";
  // question field
  let questionEl = document.createElement("div");
  questionEl.className = "flex-grow flex flex-col";
  questionEl.id = "question" + index;
  let questionInput = document.createElement("input");
  questionInput.className = "template-input";
  questionInput.placeholder = "Template Question";
  questionInput.type = "text";
  questionInput.value = q;
  questionEl.appendChild(questionInput);
  // answer field
  let answerEl = document.createElement("div");
  answerEl.className = "flex-grow flex flex-col";
  answerEl.id = "answer" + index;
  let answerInput = document.createElement("input");
  answerInput.className = "template-input";
  answerInput.placeholder = "Answer to the Question";
  answerInput.type = "text";
  answerInput.value = a;
  answerEl.appendChild(answerInput);
  inputField.appendChild(questionEl);
  inputField.appendChild(answerEl);
  templateObject.appendChild(inputField);
  // buttons
  let templateButtons = document.createElement("div");
  templateButtons.className = "template-button-group";
  // save / edit button
  let templateEditSaveButton = document.createElement("i");
  templateEditSaveButton.id = "editSaveButton-" + index;
  if (isNew) {
    templateEditSaveButton.className =
      "fa-solid fa-floppy-disk template-button";
  } else {
    templateEditSaveButton.className =
      "fa-solid fa-pen-to-square template-button";
    // add readonly attribute
    questionInput.setAttribute("readonly", "true");
    answerInput.setAttribute("readonly", "true");
    questionInput.classList.add("template-input-readonly");
    answerInput.classList.add("template-input-readonly");
  }

  templateEditSaveButton.addEventListener("click", function () {
    if (templateEditSaveButton.className.includes("fa-floppy-disk")) {
      templates[parseInt(this.id.split("-")[1])].q = questionInput.value;
      templates[parseInt(this.id.split("-")[1])].a = answerInput.value;
      localStorage.setItem("templates", JSON.stringify(templates));
      templateEditSaveButton.className =
        "fa-solid fa-pen-to-square template-button";
      // add readonly attribute
      questionInput.setAttribute("readonly", "true");
      answerInput.setAttribute("readonly", "true");
      questionInput.classList.add("template-input-readonly");
      answerInput.classList.add("template-input-readonly");
    } else if (templateEditSaveButton.className.includes("fa-pen-to-square")) {
      templateEditSaveButton.className =
        "fa-solid fa-floppy-disk template-button";
      // remove readonly attribute
      questionInput.removeAttribute("readonly");
      answerInput.removeAttribute("readonly");
      questionInput.classList.remove("template-input-readonly");
      answerInput.classList.remove("template-input-readonly");
    }
  });
  let templateDeleteButton = document.createElement("i");
  templateDeleteButton.className = "fa-solid fa-trash template-button";
  templateDeleteButton.addEventListener("click", function () {
    templates.splice(parseInt(this.id.split("-")[1]), 1);
    localStorage.setItem("templates", JSON.stringify(templates));
    displayTemplates();
  });

  templateButtons.appendChild(templateEditSaveButton);
  templateButtons.appendChild(templateDeleteButton);
  templateObject.appendChild(templateButtons);
  let parent = document.getElementById("templateContainer");
  // insert at position before the last element (add button)
  let addButtonChild = parent.lastElementChild;
  parent.insertBefore(templateObject, addButtonChild);
  let templateCounter = document.getElementById("templateCounter");
  templateCounter.textContent = templates.length + " / 10";
}

/*
  --------------------------------------------
  ! USER SETTINGS FUNCTIONALITY STARTS HERE !
  --------------------------------------------
*/

let userSettingsButton: HTMLElement =
  document.getElementById("UserSettingsButton");
let userSettingsButton2: HTMLElement = document.getElementById(
  "UserSettingsButton2"
);
let userSettingsContainer: HTMLElement = document.getElementById(
  "UserSettingsContainer"
);
if (apiKey === "") {
  userSettingsContainer.classList.remove("hidden");
}
userSettingsButton.addEventListener("click", async (_e: MouseEvent) => {
  userSettingsContainer.classList.toggle("hidden");
});
userSettingsButton2.addEventListener("click", async (_e: MouseEvent) => {
  userSettingsContainer.classList.toggle("hidden");
});

let closeSettingsEvent = (e: Event) => {
  userSettingsContainer.classList.toggle("hidden");
  successfullySavedTag.classList.add("hidden");
};

let closeSettingsButton: HTMLElement = document.getElementById(
  "CloseSettingsButton"
);
let closeSettingsIcon: HTMLElement =
  document.getElementById("CloseSettingsIcon");
closeSettingsButton.addEventListener("click", closeSettingsEvent);
closeSettingsIcon.addEventListener("click", closeSettingsEvent);
// applySettingsButton.addEventListener("click", closeSettingsEvent);

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

/*
  ----------------------
  ! TAB SWITCH CLICK EVENTS !
  ----------------------
*/
document.getElementById("tab-generator").addEventListener("click", function () {
  showSection("generator");
});
document.getElementById("tab-tooltips").addEventListener("click", function () {
  showSection("tooltip");
});
document.getElementById("tab-templates").addEventListener("click", function () {
  showSection("template");
});

function showSection(sectionId: string): void {
  // Hide all sections
  document.getElementById("generator").classList.add("hidden");
  document.getElementById("tooltip").classList.add("hidden");
  document.getElementById("template").classList.add("hidden");

  // Remove selected class from all tabs
  document.getElementById("tab-generator").classList.remove("page-selected");
  document.getElementById("tab-tooltips").classList.remove("page-selected");
  document.getElementById("tab-templates").classList.remove("page-selected");

  document.getElementById(sectionId).classList.remove("hidden");

  let replyGeneratorOutput = document.getElementById("ReplyGeneratorOutput");

  if (sectionId === "generator") {
    document.getElementById("tab-generator").classList.add("page-selected");
    replyGeneratorOutput.classList.remove("hidden");
  } else if (sectionId === "tooltip") {
    document.getElementById("tab-tooltips").classList.add("page-selected");
    replyGeneratorOutput.classList.add("hidden");
  } else if (sectionId === "template") {
    document.getElementById("tab-templates").classList.add("page-selected");
    replyGeneratorOutput.classList.add("hidden");
  }
}
