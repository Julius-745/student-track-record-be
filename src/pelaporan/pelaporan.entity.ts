import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Siswa } from '../siswa/siswa.entity';
import { Guru } from '../guru/guru.entity';

@Entity('pelaporan')
export class Pelaporan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Siswa, (siswa) => siswa.pelaporans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_siswa' })
  siswa: Siswa;

  @Column({ name: 'id_siswa' })
  siswaId: string;

  @ManyToOne(() => Guru, (guru) => guru.pelaporans, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_guru' })
  guru: Guru;

  @Column({ name: 'id_guru', nullable: true })
  guruId: string;

  @Column({ name: 'jenis_pelaporan' })
  jenis_pelaporan: string; // 'prestasi' | 'pelanggaran'

  @Column({ name: 'deskripsi', type: 'text' })
  deskripsi: string;

  @Column({ type: 'date' })
  tanggal: string;

  @CreateDateColumn()
  created_at: Date;
}
