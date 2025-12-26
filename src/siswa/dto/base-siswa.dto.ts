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

  @ApiProperty({ example: 'XII IPA 1' })
  @IsString()
  @IsNotEmpty()
  rombel: string;
}
