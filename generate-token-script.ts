
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/auth/auth.service';
import { Guru } from './src/guru/guru.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const dataSource = app.get(DataSource);
  
  // Find a non-admin guru
  const guruRepo = dataSource.getRepository(Guru);
  const guru = await guruRepo.findOne({ where: { role: 'guru' } }); // Find first teacher
  
  if (guru) {
    const result = await authService.generateResetToken(guru.id);
    console.log('MAGIC_LINK_RESULT:', result.resetLink);
    console.log('USER_EMAIL:', guru.email);
  } else {
    console.log('No guru found');
  }
  
  await app.close();
}
bootstrap();
