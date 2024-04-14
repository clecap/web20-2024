# ChatGPT Thunderbird Extension

## Prerequisites

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm)
2. Install Node.js by running `nvm install node`
3. Run `npm install` in this directory
4. Insert your Chat-GPT API Key in `src/chatgpt/api-key.const.ts`

## How to build the Thunderbird Extension

1. Run `./build` in this directory
2. Install the generated xpi into thunderbird

## Usage

1. Display an email
2. Click 'ChatGPT Thunderbird' button where 'Reply', 'Forward',... buttons are located
3. Choose wanted reply intention provided by ChatGPT and reply tone
4. Generate reply via 'Generate' Button
5. Once satisfied with given reply, click 'Choose' Button
6. Now you can edit the message and then send it.
