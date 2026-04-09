import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RessetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  verifyPassword: string;
}
