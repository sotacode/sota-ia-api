import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';
import { ProsConstDiscusserDto } from './dtos/proscons.dto';
import type { Response } from 'express';
import { TranslateDto } from './dtos/translate';
import { TextToAudioDto } from './dtos/texttoaudio';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudioToTextDto } from './dtos/audiototext.dto';

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

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudio: TextToAudioDto,
    @Res() res: Response
  ){
    const filePath = await this.gptService.textToAudio(textToAudio);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string
  ){
    const filePath = await this.gptService.textToAudioGetter(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination: 'generated/uploads',
        filename: (req, file, cb) => {
          const fileExtention = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtention}`;
          return cb(null, fileName);
        }
      })
    })
  )
  async audiotoText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({maxSize: 1000 * 1024 * 5, message: 'File too large'}),
          new FileTypeValidator({fileType: 'audio/*'})
        ]
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto?: AudioToTextDto
  ){
    return this.gptService.audioToText(file, audioToTextDto);
  }
  
}
