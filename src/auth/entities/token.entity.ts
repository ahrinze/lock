import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: false, unique: true })
  userId: string;

  @Column({ name: 'token_hash', nullable: false })
  @Index({ unique: true })
  tokenHash: string;

  @Column({ default: null, nullable: true, name: 'used_at' })
  usedAt: Date;

  @Column({ nullable: false, name: 'expired_at' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
