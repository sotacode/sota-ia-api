import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCases = async (openai: OpenAI, options: Options) => {
    const { prompt, lang } = options;
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                translate the following text to ${lang} language: ${prompt}
                `
            },
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.2,
        max_tokens: 250,
    });
    const response = completion.choices[0].message.content;
    return {
        prompt: prompt,
        completion: response
    };
}