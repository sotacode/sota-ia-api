import { IsInt, IsOptional, IsString } from "class-validator";

export class ProsConstDiscusserDto {

    @IsString()
    readonly prompt: string;

    @IsInt()
    @IsOptional()
    readonly maxTokens?: number;
}