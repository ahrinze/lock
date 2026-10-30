import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'encryption_key' })
export class EncryptionKey {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column()
  dek: string;
}
