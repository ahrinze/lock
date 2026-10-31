import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from './token.service.js';
import { PasswordService } from './password.service.js';
import { SignUpRequestDto } from '../dto/sign-up.dto.js';
import { Credential } from '../entities/credential.entity.js';
import { Token } from '../entities/token.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Credential)
    private credentialRepo: Repository<Credential>,

    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,

    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {}

  async signUp(signUpRequestDto: SignUpRequestDto) {
    // normalize the email
    const emailLower = signUpRequestDto.email.toLowerCase();

    // check for existing user
    const existingUser = await this.userRepo.findOneBy({ email: emailLower });
    if (existingUser) {
      throw new Error(`User with this email, ${emailLower} already exists`);
    }

    // hash the password
    const passwordHash = await this.passwordService.hash(
      signUpRequestDto.password,
    );

    // store the user and credential info.
    const user = this.userRepo.create({
      email: emailLower,
    });
    await this.userRepo.insert(user);

    await this.credentialRepo.insert(
      this.credentialRepo.create({
        user: { id: user.id },
        passwordHash,
      }),
    );

    // Issue verification token to user
    this.tokenService.issue(user.id);
  }

  async verifyEmail(token: string) {
    // Verify token
    const row = await this.tokenService.verify(token);
    if (!row) {
      throw new Error('Invalid token, token already used or expired');
    }

    // if token: mark as used
    row.usedAt = new Date(Date.now());
    this.tokenRepo.save(row);

    // return success
    return { success: true };
  }

  async signIn() {}

  async invite() {}

  async setupPassword() {}
}
