import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './services/auth.service.js';
import { UserModule } from '../user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionKey } from './entities/encryption-key.entity.js';
import { Credential } from './entities/credential.entity.js';
import { PasswordService } from './services/password.service.js';
import { TokenService } from './services/token.service.js';
import { Token } from './entities/token.entity.js';
import { User } from '../user/user.entity.js';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Credential, EncryptionKey, Token]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService],
})
export class AuthModule {}
