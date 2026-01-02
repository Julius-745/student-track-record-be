import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class BasePelaporanDto {
  @ApiProperty({ example: 'Perilaku baik dan aktif di kelas' })
  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @ApiProperty({ example: 'pelanggaran' })
  @IsString()
  @IsNotEmpty()
  jenis_pelaporan: string;

  @ApiProperty({ example: '2026-01-02' })
  @IsString()
  @IsNotEmpty()
  tanggal: string;
}
