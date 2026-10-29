import { Column, Entity } from 'typeorm';

@Entity({ name: 'encryption_key' })
export class EncryptionKey {
  userId: string;

  @Column()
  dek: string;
}
