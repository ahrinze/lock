import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { Token } from '../entities/token.entity.js';
import { Repository } from 'typeorm';

export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepo: Repository<Token>,
  ) {}

  async issue(userId: string) {
    // Generate a random token
    const token = randomBytes(32).toString('hex');
    // Hash the generated token
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Store the tokenHash in the database
    this.tokenRepo.save(
      this.tokenRepo.create({
        userId,
        tokenHash,
        expiredAt: new Date(Date.now() + 60 * 15 * 1000), // expires in 15 minutes
      }),
    );

    // Send the token to the user
    console.log(token);
  }

  async verify(rawToken: string): Promise<Token | null> {
    // Hash the token
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    // Find token in the db: check for expiration and usage
    const row = await this.tokenRepo.findOneBy({ tokenHash });
    if (!row) return null;
    if (row.usedAt) return null;
    if (row.expiredAt.getTime() <= Date.now()) return null;

    return row;
  }
}
