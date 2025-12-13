import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiswaService } from './siswa.service';
import { SiswaController } from './siswa.controller';
import { Siswa } from './siswa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Siswa])],
  controllers: [SiswaController],
  providers: [SiswaService],
})
export class SiswaModule {}
