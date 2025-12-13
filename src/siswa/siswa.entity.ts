import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Pelaporan } from '../pelaporan/pelaporan.entity';

@Entity('siswa')
export class Siswa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rombel_saat_ini' })
  rombel: string;

  @Column()
  nama: string;

  @Column()
  nipd: string;

  @Column({ name: 'jenis_kelamin', length: 1 })
  jenis_kelamin: string; // 'L' | 'P'

  @Column({ nullable: true })
  nisn: string;

  @Column({ name: 'tempat_lahir', nullable: true })
  tempat_lahir: string;

  @Column({ name: 'tanggal_lahir', type: 'date', nullable: true })
  tanggal_lahir: string;

  @Column({ nullable: true })
  nik: string;

  @Column({ nullable: true })
  agama: string;

  @Column({ nullable: true })
  alamat: string;

  @Column({ nullable: true })
  rt: string;

  @Column({ nullable: true })
  rw: string;

  @Column({ nullable: true })
  dusun: string;

  @Column({ nullable: true })
  kelurahan: string;

  @Column({ nullable: true })
  kecamatan: string;

  @Column({ name: 'kode_pos', nullable: true })
  kode_pos: string;

  @Column({ name: 'jenis_tinggal', nullable: true })
  jenis_tinggal: string;

  @Column({ name: 'alat_transportasi', nullable: true })
  alat_transportasi: string;

  @Column({ name: 'no_hp', nullable: true })
  no_hp: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  skhun: string;

  @Column({ name: 'penerima_kps', nullable: true })
  penerima_kps: string;

  @Column({ name: 'no_kps', nullable: true })
  no_kps: string;

  @OneToMany(() => Pelaporan, (pelaporan) => pelaporan.siswa)
  pelaporans: Pelaporan[];
}
