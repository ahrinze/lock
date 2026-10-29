import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionKey } from './entities/encryption-key.entity.js';
import { Credential } from './entities/credential.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Credential, EncryptionKey]), UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
