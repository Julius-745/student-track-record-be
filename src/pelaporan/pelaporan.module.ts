import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PelaporanService } from './pelaporan.service';
import { PelaporanController } from './pelaporan.controller';
import { Pelaporan } from './pelaporan.entity';
import { Siswa } from '../siswa/siswa.entity';
import { Guru } from '../guru/guru.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pelaporan, Siswa, Guru])],
  controllers: [PelaporanController],
  providers: [PelaporanService],
})
export class PelaporanModule {}
