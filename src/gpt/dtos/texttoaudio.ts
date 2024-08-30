import { IsInt, IsOptional, IsString } from "class-validator";

export class TextToAudioDto {

    @IsString()
    readonly prompt: string;

    @IsString()
    @IsOptional()
    readonly voice?: string;

    @IsInt()
    @IsOptional()
    readonly maxTokens?: number;
}