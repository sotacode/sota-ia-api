import { Injectable } from '@nestjs/common';
import { ortographyCheckUseCases, prosConsDiscusserStreamUseCases, prosConsDiscusserUseCases } from './use-cases';
import { OrthographyDto } from './dtos';
import OpenAI from "openai";
import { ProsConstDiscusserDto } from './dtos/proscons.dto';
import { TranslateDto } from './dtos/translate';
import { translateUseCases } from './use-cases/translate.us-cases';

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

}
