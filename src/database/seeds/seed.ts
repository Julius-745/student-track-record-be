import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Siswa } from '../../siswa/siswa.entity';
import { Guru } from '../../guru/guru.entity';
import { Pelaporan } from '../../pelaporan/pelaporan.entity';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'student_track_record',
  entities: [Siswa, Guru, Pelaporan],
  synchronize: true, // Should be true for dev/seeding to ensure tables exist
});

// eslint-disable-next-line @typescript-eslint/require-await
const generateSiswa = async (count: number) => {
  const siswaList: Siswa[] = [];
  const classes = ['7A', '7B', '7C', '8A', '8B', '8C', '9A', '9B', '9C'];

  for (let i = 0; i < count; i++) {
    const siswa = new Siswa();
    // 5 digit NIPD sequence starting from 10000 + i
    siswa.nipd = (10000 + i).toString();
    siswa.nama = faker.person.fullName();
    siswa.rombel = faker.helpers.arrayElement(classes);
    siswa.jenis_kelamin = faker.helpers.arrayElement(['L', 'P']);
    // siswa.poin = 100; // Removed as it does not exist in entity
    siswaList.push(siswa);
  }
  return siswaList;
};

const generateGuru = async (count: number) => {
  const guruList: Guru[] = [];
  const positions = ['Guru Mapel', 'Wali Kelas', 'Guru BK', 'Kepala Sekolah'];
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('password123', salt); // Default password
  const adminPassword = await bcrypt.hash('admin', salt);

  // Create Admin
  const admin = new Guru();
  admin.nip = '9999999';
  admin.nama = 'Admin Sistem';
  admin.posisi = 'Administrator';
  admin.email = 'admin@sekolah.id';
  admin.password = adminPassword;
  admin.role = 'admin';
  guruList.push(admin);

  for (let i = 0; i < count; i++) {
    const guru = new Guru();
    guru.nip = faker.number.int({ min: 19600000, max: 20000000 }).toString(); // Pseudo NIP
    guru.nama = faker.person.fullName();
    guru.posisi = faker.helpers.arrayElement(positions);
    guru.email = faker.internet.email({ firstName: guru.nama.split(' ')[0] });
    guru.password = hashedPassword;
    guru.role = 'guru';
    guruList.push(guru);
  }
  return guruList;
};

const generatePelaporan = async (
  count: number,
  siswaList: Siswa[],
  guruList: Guru[],
) => {
  const pelaporanList: Pelaporan[] = [];

  for (let i = 0; i < count; i++) {
    const pelaporan = new Pelaporan();
    pelaporan.siswa = faker.helpers.arrayElement(siswaList);
    pelaporan.guru = faker.helpers.arrayElement(guruList);
    pelaporan.jenis_pelaporan = faker.helpers.arrayElement([
      'prestasi',
      'pelanggaran',
    ]);

    if (pelaporan.jenis_pelaporan === 'prestasi') {
      pelaporan.deskripsi = faker.helpers.arrayElement([
        'Juara 1 Lomba Matematika',
        'Juara 2 Lomba Puisi',
        'Membantu guru membersihkan kelas',
        'Menjadi petugas upacara terbaik',
        'Juara Kelas',
      ]);
    } else {
      pelaporan.deskripsi = faker.helpers.arrayElement([
        'Terlambat masuk sekolah',
        'Tidak mengerjakan PR',
        'Ribut di kelas',
        'Membuang sampah sembarangan',
        'Tidak memakai atribut lengkap',
      ]);
    }

    pelaporan.tanggal = faker.date
      .recent({ days: 30 })
      .toISOString()
      .split('T')[0];
    pelaporanList.push(pelaporan);
  }
  return pelaporanList;
};

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding...');

    const siswaRepo = AppDataSource.getRepository(Siswa);
    const guruRepo = AppDataSource.getRepository(Guru);
    const pelaporanRepo = AppDataSource.getRepository(Pelaporan);

    // Cleansing Data
    console.log('Clearing existing data...');
    // Use TRUNCATE to clear tables cleanly with foreign key handling
    await AppDataSource.query(
      'TRUNCATE TABLE "pelaporan", "siswa", "guru" RESTART IDENTITY CASCADE;',
    );

    // Seeding
    console.log('Seeding Siswa...');
    const siswaData = await generateSiswa(50); // 50 Students
    await siswaRepo.save(siswaData);

    console.log('Seeding Guru...');
    const guruData = await generateGuru(10); // 10 Teachers + 1 Admin
    await guruRepo.save(guruData);

    console.log('Seeding Pelaporan...');
    const pelaporanData = await generatePelaporan(30, siswaData, guruData);
    await pelaporanRepo.save(pelaporanData);

    console.log('Seeding Configured Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
