import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Credential {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;
}
