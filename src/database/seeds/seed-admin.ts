import { DataSource } from 'typeorm';
import { Guru } from '../../guru/guru.entity';
import { Siswa } from '../../siswa/siswa.entity';
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
  entities: [Guru, Siswa, Pelaporan],
  synchronize: true,
});

const generateAdmin = async () => {
  const salt = await bcrypt.genSalt();
  const adminPassword = await bcrypt.hash('admin', salt);

  const admin = new Guru();
  admin.nip = '9999999';
  admin.nama = 'Admin Sistem';
  admin.posisi = 'Administrator';
  admin.email = 'admin@sekolah.id';
  admin.password = adminPassword;
  admin.role = 'admin';

  return admin;
};

const seedAdmin = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for admin seeding...');

    const guruRepo = AppDataSource.getRepository(Guru);

    // Check if admin already exists
    const existingAdmin = await guruRepo.findOne({
      where: { email: 'admin@sekolah.id' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      const salt = await bcrypt.genSalt();
      const adminPassword = await bcrypt.hash('admin', salt);
      existingAdmin.password = adminPassword;
      await guruRepo.save(existingAdmin);
      console.log('Admin password updated successfully!');
    } else {
      console.log('Creating Admin user...');
      const adminData = await generateAdmin();
      await guruRepo.save(adminData);
      console.log('Admin user created successfully!');
    }

    console.log('\nAdmin credentials:');
    console.log('Email: admin@sekolah.id');
    console.log('Password: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error during admin seeding:', error);
    process.exit(1);
  }
};

void seedAdmin();
