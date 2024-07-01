# Thunderbird AI Extension

## Introduction

The ChatGPT Thunderbird Extension uses OpenAI's GPT-3.5 API to assist with email writing. It allows you to generate automatic responses in various tones and styles.

## Authors

- [@NoahLeu](https://www.github.com/NoahLeu)
- [@hippokratius](https://www.github.com/hippokratius)
- [@hawk305](https://www.github.com/hawk305)
- [@alex199626](https://www.github.com/alex199626)
- [@paulinem-unirostock](https://www.github.com/paulinem-unirostock)
- [@Lukasz-Reszcz](https://www.github.com/Lukasz-Reszcz)
- [@HuseynAhmedov](https://www.github.com/HuseynAhmedov)

## Installation

## Prerequisites

Note for Windows User: Before you start, it's recommended to install the Windows Subsystem for Linux (WSL) on your Windows computer and clone the repository directly in the WSL environment. This will make it easier to follow all the steps. Follow these instructions:

1. **Install WSL**

   - [WSL Installation Guide](https://docs.microsoft.com/en-us/windows/wsl/install)
   - Open PowerShell as Administrator and run:
     ```sh
     wsl --install
     ```
   - Restart your computer.

2. **Set Up WSL**

   - Open WSL (e.g., Ubuntu) and complete the setup.

3. **Clone the Repository**
   - Clone the repository into your WSL environment:
     ```sh
     git clone https://github.com/clecap/web20-2024.git
     cd <repo-name>
     ```

From here the Installation Process is the same for all Operationg Systems:

1. **Install Node Version Manager (nvm)**

   - [Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating)

2. **Install Node.js**

   - Install the latest version with:
     ```sh
     nvm install node
     ```

3. **Install Project Dependencies**
   - Navigate to the project directory and run:
     ```sh
     npm install
     ```

## Build the Extension

To build the extension, follow these steps:

1. Run the build script in the project directory:

   ```sh
   ./build
   ```

2. Install the generated `.xpi` file into Thunderbird:
   - Open Thunderbird.
   - Go to `Tools` > `Add-ons`.
   - Click on the gear icon and select `Install Add-on From File...`.
   - Choose the generated `.xpi` file and follow the prompts.

## Usage

To use the ChatGPT Thunderbird Extension:

1. Open an email in Thunderbird.
2. Click the 'ChatGPT Thunderbird' button located alongside the 'Reply', 'Forward', etc. buttons.
3. On your first use, you will need to provide your OpenAI API key. To do this click on 'General Settings', enter the key and click 'Save'.
4. Select the desired reply intention and tone provided by ChatGPT.
5. Click the 'Generate' button to create a reply.
6. Review the generated reply. Once satisfied, click the 'Choose' button.
7. Edit the message as needed and then send it.

## Current Features

- Email writing, Summary support using OpenAI's GPT-3.5 API.
- Personalization options for generated messages.
- Summary of the email content using the LLM API.
- Template based generation context for LLM (e.g. provide chatgpt with information on your work place in a question-answer format).

## Roadmap

### Planned

- [x] Improve the current E-Mail writing support
  - [ ] Human like writing
  - [x] More message personalization options
- [x] Add a summary based on LLM API
  - [x] Summarize key points
  - [x] Note important details (events, calendar details, ...)

### Optional

- [ ] Send AI generated calendar invites
- [ ] Check own calendar availability before sending invites

## Roles

### Project Management

- [@NoahLeu](https://www.github.com/NoahLeu)

### BE: Team 1 (Writing Assistant)

- [@NoahLeu](https://www.github.com/NoahLeu)
- [@alex199626](https://www.github.com/alex199626)
- [@paulinem-unirostock](https://www.github.com/paulinem-unirostock)

### BE: Team 2 (Summarization Tool)

- [@hawk305](https://www.github.com/hawk305)
- [@Lukasz-Reszcz](https://www.github.com/Lukasz-Reszcz)

### FE

- [@HuseynAhmedov](https://www.github.com/HuseynAhmedov)

## License

[MIT](https://choosealicense.com/licenses/mit/)
