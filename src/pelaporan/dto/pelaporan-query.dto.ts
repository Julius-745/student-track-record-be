import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

export class PelaporanQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'andi' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'prestasi' })
  @IsString()
  @IsOptional()
  jenis_pelaporan?: string;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-12-31' })
  @IsString()
  @IsOptional()
  endDate?: string;
}
