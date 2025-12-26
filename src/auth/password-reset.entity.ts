import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guru } from '../guru/guru.entity';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  email: string;

  @ManyToOne(() => Guru, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'guru_id' })
  guru: Guru;

  @Column({ name: 'guru_id' })
  guru_id: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
