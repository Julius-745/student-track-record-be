import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pelaporan } from '../pelaporan/pelaporan.entity';

@Entity('guru')
export class Guru {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nip: string;

  @Column()
  nama: string;

  @Column()
  posisi: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'guru' })
  role: string; // 'guru' | 'admin'

  @OneToMany(() => Pelaporan, (pelaporan) => pelaporan.guru)
  pelaporans: Pelaporan[];
}
