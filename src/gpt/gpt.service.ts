import * as path from "path";
import * as fs from "fs";
import { Injectable, NotFoundException } from '@nestjs/common';
import { ortographyCheckUseCases, prosConsDiscusserStreamUseCases, prosConsDiscusserUseCases } from './use-cases';
import { OrthographyDto } from './dtos';
import OpenAI from "openai";
import { ProsConstDiscusserDto } from './dtos/proscons.dto';
import { TranslateDto } from './dtos/translate';
import { translateUseCases } from './use-cases/translate.us-cases';
import { TextToAudioDto } from './dtos/texttoaudio';
import { textToAudioUseCases } from './use-cases/text-to-audio.us-cases';
import { audioToTextUseCases } from "./use-cases/audio-to-text.us-cases";
import { AudioToTextDto } from './dtos/audiototext.dto';

@Injectable()
export class GptService {
    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    async ortographyCheck(orthographyDto: OrthographyDto) {
        return await ortographyCheckUseCases(this.openai, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConstDiscusser(prosConsDiscusser: ProsConstDiscusserDto){
        return await prosConsDiscusserUseCases(this.openai, {
            prompt: prosConsDiscusser.prompt
        })
    }

    async prosConstDiscusserStream(prosConsDiscusser: ProsConstDiscusserDto){
        return await prosConsDiscusserStreamUseCases(this.openai, {
            prompt: prosConsDiscusser.prompt
        })
    }

    async translate(translate: TranslateDto){
        return await translateUseCases(this.openai, {
            prompt: translate.prompt,
            lang: translate.lang
        })
    }

    async textToAudio(textToAudio: TextToAudioDto){
        return await textToAudioUseCases(this.openai, textToAudio);
    }

    async textToAudioGetter(fileId: string){
        const folerPath = path.resolve(__dirname, "..", "..", "generated", "audios",`${fileId}.mp3`);
        const itWasFound = fs.existsSync(folerPath);
        if(!itWasFound){
            new NotFoundException(`File ${fileId} not found`);
        }
        return folerPath;
    }

    async audioToText(audioFile: Express.Multer.File, audioToTextDto?: AudioToTextDto){
        const prompt = audioToTextDto?.prompt || "";
        return await audioToTextUseCases(this.openai, {audioFile, prompt});
    }

}
