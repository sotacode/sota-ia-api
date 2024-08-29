import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDiscusserStreamUseCases = async (openai: OpenAI, options: Options) => {
    const { prompt } = options;
    return await openai.chat.completions.create({
        stream: true,
        messages: [
            {
                role: "system",
                content: `
                    You will be given a question, and your task is to provide an answer with pros and cons. The response should be in markdown format, and the pros and cons should be listed
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 500,
    });

}