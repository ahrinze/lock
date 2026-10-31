import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { SignUpRequestDto } from './dto/sign-up.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    return this.authService.signUp(signUpRequestDto);
  }

  @Post('verify')
  verify() {
    return this.authService.verify;
  }

  @Post('sign-in')
  signIn() {
    return this.authService.signIn;
  }

  @Post('invite')
  async invite() {
    return this.authService.invite;
  }

  @Post('setup-password')
  async setupPassword() {
    return this.authService.setupPassword;
  }
}
