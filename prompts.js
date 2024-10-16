import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { OPEN_AI_KEY } from './config.js'

const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo-0125',
    openAIApiKey: OPEN_AI_KEY,
    temperature: 0.7
});

const tweetTemplate = 'Generate a promotional tweet for a product, from this product description: {productDesc}'

const prompt = PromptTemplate.fromTemplate(tweetTemplate);

const chain = prompt.pipe(llm);

const response = await chain.invoke({
    productDesc: 'Nike Jordins'
});

console.log("RESPONSE::", response)