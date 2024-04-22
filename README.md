
# Thunderbird AI Extension

Thunderbird E-Mail Client Extension for Writing and Summarizing E-Mails using AI.

## Authors

- [@NoahLeu](https://www.github.com/NoahLeu)
- [@hippokratius](https://www.github.com/hippokratius)
- [@hawk305](https://www.github.com/hawk305)
- [@alex199626](https://www.github.com/alex199626)
- [@paulinem-unirostock](https://www.github.com/paulinem-unirostock)
- [@Lukasz-Reszcz](https://www.github.com/Lukasz-Reszcz)
- [@HuseynAhmedov](https://www.github.com/HuseynAhmedov)


## Installation

### Prerequisites 

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm)
2. Install Node.js by running nvm install node
3. Run npm install in this directory
4. Insert your Chat-GPT API Key in src/chatgpt/api-key.const.ts

### Build Extension

Run ./build in the root of the project
Install the generated xpi into thunderbird as an extension
## Usage

1. Display an email
2. Click 'ChatGPT Thunderbird' button where 'Reply', 'Forward',... buttons are located
3. Choose wanted reply intention provided by ChatGPT and reply tone
4. Generate reply via 'Generate' Button
5. Once satisfied with given reply, click 'Choose' Button
6. Now you can edit the message and then send it.

## Current Features

- E-Mail writing support using OpenAI's gpt-3.5 API
## Roadmap

### Planned
* [ ] Improve the current E-Mail writing support
    * [ ] Human like writing
    * [ ] More message personalization options
* [ ] Add a summary based on LLM API
    * [ ] Summarize key points
    * [ ] Note important details (events, calendar details, ...)

### Optional
* [ ] Send AI generated calendar invites
* [ ] Check own calendar availability before sending invites

## Roles

### BE: Team 1 (Writing Assistant)

- [@NoahLeu](https://www.github.com/NoahLeu)
- [@alex199626](https://www.github.com/alex199626)
- [@paulinem-unirostock](https://www.github.com/paulinem-unirostock)

### BE: Team 2 (Summarization Tool)

- [@hippokratius](https://www.github.com/hippokratius)
- [@hawk305](https://www.github.com/hawk305)
- [@Lukasz-Reszcz](https://www.github.com/Lukasz-Reszcz)

### FE

- [@HuseynAhmedov](https://www.github.com/HuseynAhmedov)


## License

[MIT](https://choosealicense.com/licenses/mit/)

