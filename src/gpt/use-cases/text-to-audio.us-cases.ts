import OpenAI from "openai";
import * as path from "path";
import * as fs from "fs";

interface Options {
    prompt: string;
    voice?: string;
}

export const textToAudioUseCases = async (openai: OpenAI, options: Options) => {
    const { prompt, voice } = options;
    const voices = {
        "nova": "nova",
        "alloy": "alloy",
        "echo": "echo",
        "fable": "fable",
        "onyx": "onyx",
        "shimmer": "shimmer",
    }

    const voiceSelected = voices[voice] || "nova";
    const folerPath = path.resolve(__dirname, "..", "..","..", "generated", "audios");
    const speechFile = path.resolve(folerPath, `${new Date().getTime()}.mp3`);
    await fs.promises.mkdir(folerPath, { recursive: true });

    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: voiceSelected,
        input: prompt,
        response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(speechFile,buffer);
    /*const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `
                translate the following text to ${voice} language: ${prompt}
                `
            },
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.2,
        max_tokens: 250,
    });
    const response = completion.choices[0].message.content;*/
    return speechFile;
}