import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BasePelaporanDto {
  @ApiProperty({ example: 'Perilaku baik dan aktif di kelas' })
  @IsString()
  @IsNotEmpty()
  catatan: string;
}
