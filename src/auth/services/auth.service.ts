import { Repository } from 'typeorm';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../../user/user.entity.js';
import { TokenService } from './token.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entities/token.entity.js';
import { PasswordService } from './password.service.js';
import { SignUpRequestDto } from '../dto/sign-up.dto.js';
import { Credential } from '../entities/credential.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Credential)
    private credentialRepo: Repository<Credential>,

    private passwordService: PasswordService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async signUp(signUpRequestDto: SignUpRequestDto) {
    // normalize the email
    const emailLower = signUpRequestDto.email.toLowerCase();

    // check for existing user
    const existingUser = await this.userRepo.findOneBy({ email: emailLower });
    if (existingUser) {
      throw new ConflictException(
        `User with this email, '${emailLower}' already exists`,
      );
    }

    // hash the password
    const passwordHash = await this.passwordService.hash(
      signUpRequestDto.password,
    );

    // Transaction: Save credential and user
    const savedUser = await this.dataSource.transaction(async (mgr) => {
      const createdUser = await mgr.save(
        mgr.create(User, { email: emailLower }),
      );

      await mgr.save(
        mgr.create(Credential, {
          user: { id: createdUser.id },
          passwordHash,
        }),
      );

      return createdUser;
    });

    // Issue verification token to user
    this.tokenService.issue(savedUser.id);

    // return response
    return {
      success: true,
      message: 'Account created successfully.',
    };
  }

  async verifyEmail(token: string) {
    // Verify token
    const row = await this.tokenService.verify(token);

    await this.dataSource.transaction(async (mgr) => {
      // Mark token as used
      row.usedAt = new Date();
      await mgr.save(row);

      // Mark user as verified
      await mgr.update(User, row.userId, { emailVerified: true });
    });

    return {
      success: true,
      message: 'Your account has been verified successfully.',
    };
  }

  async signIn(response: Response, email: string, password: string) {
    const existingUser = await this.userRepo.findOneBy({
      email: email.toLowerCase(),
    });
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credential', {
        cause: 'email not found',
      });
    }

    // confirm credential
    const userCredential = await this.credentialRepo.findOne({
      where: { user: { id: existingUser.id } },
    });
    if (!userCredential) {
      throw new UnauthorizedException('Invalid credential', {
        cause: 'credential not found',
      });
    }

    const isCorrect = await this.passwordService.verify(
      userCredential.passwordHash,
      password,
    );
    if (!isCorrect)
      throw new UnauthorizedException('Invalid credential', {
        cause: "password doesn't match",
      });

    // sign jwt
    const jti = randomUUID();
    const accessToken = this.jwtService.sign(
      { sub: existingUser.id, jti, scope: 'access' },
      {
        secret: this.configService.getOrThrow('JWT_SECRET_KEY'),
        expiresIn: '5m',
      },
    );

    // Store token in cookie
    // response.cookie('access_token', accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    //   sameSite: 'strict', // CSRF protection
    //   maxAge: 300_000, // 5 minutes in milliseconds
    // });

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: existingUser,
      },
    };
  }

  async forgotPassword(email: string) {
    const emailLower = email.toLowerCase();
    const user = await this.userRepo.findOneBy({ email: emailLower });

    if (user) this.tokenService.issue(user.id);

    return {
      success: true,
      message: 'if user exists they would get an reset password email',
    };
  }

  async resetPassword(rawToken: string, password: string) {
    const row = await this.tokenService.verify(rawToken);

    const passwordHash = await this.passwordService.hash(password);

    await this.dataSource.transaction(async (mgr) => {
      await mgr.update(Token, row.id, { usedAt: new Date() });
      await mgr.update(Credential, { userId: row.userId }, { passwordHash });
    });

    return {
      success: true,
      message: 'Reset password successful',
    };
  }

  async invite() {}

  async setupPassword() {}
}
