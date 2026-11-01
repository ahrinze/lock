import { Controller, Res } from '@nestjs/common';
import { Body, Get, Post, Query } from '@nestjs/common';
import { SignUpRequestDto } from './dto/sign-up.dto.js';
import { AuthService } from './services/auth.service.js';
import { SignInRequestDto } from './dto/sign-in.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpRequestDto: SignUpRequestDto) {
    return await this.authService.signUp(signUpRequestDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Post('sign-in')
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.signIn(
      response,
      signInRequestDto.email,
      signInRequestDto.password,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(
      token,
      resetPasswordDto.password,
    );
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
