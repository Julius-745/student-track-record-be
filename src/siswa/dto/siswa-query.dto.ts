import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

export class SiswaQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'andi' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'X IPA 2' })
  @IsString()
  @IsOptional()
  rombel?: string;
}
