import * as models from './models.js'
import { PromptTemplate } from '@langchain/core/prompts'
import { supabaseRetriever } from './vectorstore.js'
import { combineDocuments } from './helpers.js'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

// Use OpenAI GPT model
const chatGpt = models.chatGPT;

// A string holding the phrasing of the prompt
const standaloneQuestionTemplate = `Given a question, convert it to a standalone question.
Question: {question} standalone question: 
`
// A string holding the answer template
const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba 
based on the context provided. Try to find the answer in the context. If you really don't know the answer, say 
'I\'m sorry, I don't know the answer to that.' and direct the questioner to email help@scrimba.com. 
Don't try to make up an answer. Always speak as if you were chatting to a friend. 
context: {context}
answer: 
`

// A prompt created using PrompTemplate and the fromTemplate method
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

// A prompt for the answer
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

// Create standalone, retreiver and answer runnable chains
const standaloneQuestionChain = standaloneQuestionPrompt
.pipe(chatGpt)
.pipe(new StringOutputParser());

const retrieverChain = RunnableSequence.from([
    prevResult => prevResult.question,
    supabaseRetriever,
    combineDocuments
]);

const answerChain = answerPrompt
.pipe(chatGpt)
.pipe(new StringOutputParser());

const chain = RunnableSequence.from([
    {
        question: standaloneQuestionChain,
        original_input: new RunnablePassthrough()
    },
    {
        context: retrieverChain,
        question: ({ original_input }) => original_input.question 
    },
    answerChain
])

// Invoke the model model and prompt
export const invokeModel = async (question) => await chain.invoke({
    question
});
