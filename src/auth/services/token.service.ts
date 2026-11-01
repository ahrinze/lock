import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entities/token.entity.js';
import { createHash, randomBytes } from 'node:crypto';
import { BadRequestException } from '@nestjs/common';

export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
  ) {}

  async issue(userId: string) {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    this.tokenRepo.save(
      this.tokenRepo.create({
        user: { id: userId },
        tokenHash,
        expiredAt: new Date(Date.now() + 60 * 15 * 1000), // expires in 15 minutes
      }),
    );

    // Queue: email verification token to the user
    console.log(token);
  }

  async verify(rawToken: string): Promise<Token> {
    // Hash the token
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    // Find token in the db: check for expiration and usage
    const row = await this.tokenRepo.findOneBy({ tokenHash });
    if (!row || row.usedAt || row.expiredAt.getTime() <= Date.now())
      throw new BadRequestException(
        'Invalid token, token already used or expired',
      );

    return row;
  }
}
