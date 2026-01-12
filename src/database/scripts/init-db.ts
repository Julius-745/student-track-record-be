import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import * as pg from 'pg';

dotenv.config();

async function initDb() {
  const dbName = process.env.DB_NAME || 'student_track_record';
  const systemDb = 'postgres'; // Connect to system database first to create target database

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const Client = (pg as any).Client;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: systemDb,
  });

  try {
    console.log('--- Database Initialization Started ---');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await client.connect();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName],
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await client.end();

    console.log('Running seeding script...');
    // Use npm run seed (which uses ts-node for better TypeORM compatibility)
    execSync('npm run seed', { stdio: 'inherit' });

    console.log('--- Database Initialization Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Error during database initialization:');
    console.error(error);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await client.end();
    } catch {
      // ignore
    }
    process.exit(1);
  }
}

void initDb();
