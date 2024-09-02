import OpenAI from "openai";
import * as fs from "fs";

interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}

export const audioToTextUseCases = async (openai: OpenAI, options: Options) => {
    const { audioFile, prompt } = options;
    const response = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFile.path),
        model: 'whisper-1',
        //language: 'en',     //this improve the accuracy of the transcription
        prompt: prompt,
        response_format: 'verbose_json',
    });
    return response;
}

