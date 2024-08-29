import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDiscusserUseCases = async (openai: OpenAI, options: Options) => {
    const { prompt } = options;
    const completion = await openai.chat.completions.create({
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

    console.log(completion.choices[0].message);
    //const response = JSON.parse(completion.choices[0].message.content);
    const response = completion.choices[0].message.content;
    return {
        prompt: prompt,
        completion: response
    };
}

