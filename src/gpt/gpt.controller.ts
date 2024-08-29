import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';
import { ProsConstDiscusserDto } from './dtos/proscons.dto';
import { Response } from 'express';
import { TranslateDto } from './dtos/translate';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  OrthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ){
    return this.gptService.ortographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  ProsConsDiscusser(
    @Body() prosConsDiscusser: ProsConstDiscusserDto
  ){
    return this.gptService.prosConstDiscusser(prosConsDiscusser);
  }

  @Post('pros-cons-discusser-stream')
  async ProsConsDiscusserStream(
    @Body() prosConsDiscusser: ProsConstDiscusserDto,
    @Res() res: Response
  ){
    const stream = await this.gptService.prosConstDiscusserStream(prosConsDiscusser);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);
    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      //console.log(piece);
      res.write(piece);
    }
    res.end();
  }

  @Post('translate')
  translate(
    @Body() translate: TranslateDto
  ){
    return this.gptService.translate(translate);
  }
  
}
