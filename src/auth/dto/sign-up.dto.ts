import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class SignInRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Min(8)
  password: string;
}
