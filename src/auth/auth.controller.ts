import { Controller } from '@nestjs/common';
import { Body, Get, Post, Query } from '@nestjs/common';
import { SignUpRequestDto } from './dto/sign-up.dto.js';
import { AuthService } from './services/auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    return this.authService.signUp(signUpRequestDto);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
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
