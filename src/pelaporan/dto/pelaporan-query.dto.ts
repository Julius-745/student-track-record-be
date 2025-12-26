import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

export class PelaporanQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'andi' })
  @IsString()
  @IsOptional()
  search?: string;
}
