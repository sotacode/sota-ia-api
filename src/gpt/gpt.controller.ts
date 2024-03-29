import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  OrthographyCheck(
    @Body() orthographyDto: OrthographyDto
  ){
    return this.gptService.ortographyCheck(orthographyDto);
  }
  
}
