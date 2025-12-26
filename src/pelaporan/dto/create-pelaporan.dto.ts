import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { BasePelaporanDto } from './base-pelaporan.dto';

export class CreatePelaporanDto extends BasePelaporanDto {
  @ApiProperty({ example: 'uuid-siswa' })
  @IsUUID()
  siswa_id: string;

  @ApiPropertyOptional({ example: 'uuid-guru' })
  @IsUUID()
  @IsOptional()
  guru_id?: string;
}
