import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const ortographyCheckUseCases = async (openai: OpenAI, options: Options) => {
    const { prompt } = options;
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                You are a spelling corrector; You should be able to detect the languag; what I need you to do is generate a JSON with the following structure:
                example input prompt: "i don't have any opcionn about that quesion."
                example output:
                    {
                        "total_corrections": 2, //number of corrections
                        "corrected_text": "i don't have any |option| about that |question|." //string with the corrections applied and the corrections surrounded by | |
                    }
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 250,
        response_format: {
            type: "json_object",
        }
    });

    console.log(completion.choices[0].message);
    const response = JSON.parse(completion.choices[0].message.content);
    return {
        prompt: prompt,
        completion: response
    };
}