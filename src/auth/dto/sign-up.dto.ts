import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8)
  password: string;
}
