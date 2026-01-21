import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Siswa } from '../siswa/siswa.entity';

@Entity('pelaporan')
export class Pelaporan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Siswa, (siswa) => siswa.pelaporans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_siswa' })
  siswa: Siswa;

  @Column({ name: 'id_siswa' })
  siswaId: string;

  // Use string reference instead of direct import
  @ManyToOne('Guru', 'pelaporans', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_guru' })
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  guru: any | null;

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
