import { Column, Entity } from 'typeorm';

@Entity()
export class Credential {
  userId: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;
}
