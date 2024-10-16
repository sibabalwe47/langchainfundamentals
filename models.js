import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { OPEN_AI_KEY } from './config.js'

export const chatGPT = new ChatOpenAI({
    openAIApiKey: OPEN_AI_KEY,
    temperature: 0.7,
    model: 'gpt-3.5-turbo'
});

export const chatCGPTEmbeddings = new OpenAIEmbeddings({ 
    openAIApiKey: OPEN_AI_KEY 
})
