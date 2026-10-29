import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp() {
    return this.authService.signUp;
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
