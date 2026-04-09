import { IsNotEmpty, IsOptional, isString, IsString, Length, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto { 
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    @IsOptional()
    password? : string;

    @IsOptional()
    @IsString()
    @IsOptional()
    username?: string;
}