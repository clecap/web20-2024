import {HF_TOKEN} from "./api-key.const";
import {HfInference} from "@huggingface/inference";

const inference = new HfInference(HF_TOKEN);

await inference.summarization({
    model: 'Falconsai/text_summarization',
    inputs: ""
});

