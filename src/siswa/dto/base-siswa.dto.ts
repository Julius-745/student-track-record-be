import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseSiswaDto {
  @ApiProperty({ example: 'Andi Wijaya' })
  @IsString()
  @IsNotEmpty()
  nama: string;

  @ApiProperty({ example: '22101234' })
  @IsString()
  @IsNotEmpty()
  nipd: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  nisn: string;

  @ApiProperty({ example: 'XII IPA 1' })
  @IsString()
  @IsNotEmpty()
  rombel: string;

  @ApiProperty({ example: 'Laki-laki' })
  @IsString()
  @IsNotEmpty()
  jenis_kelamin: string;

  @ApiProperty({ example: '08123456789' })
  @IsString()
  @IsNotEmpty()
  no_hp: string;

  @ApiProperty({ example: 'Jalan Sunan Ampel No. 1' })
  @IsString()
  @IsNotEmpty()
  alamat: string;

}
