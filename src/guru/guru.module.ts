import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuruService } from './guru.service';
import { GuruController } from './guru.controller';
import { Guru } from './guru.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guru])],
  controllers: [GuruController],
  providers: [GuruService],
  exports: [GuruService], // Export for AuthModule
})
export class GuruModule {}
