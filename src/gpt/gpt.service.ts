import { Injectable } from '@nestjs/common';
import { ortographyCheckUseCases } from './use-cases';
import { OrthographyDto } from './dtos';
import OpenAI from "openai";

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

}
