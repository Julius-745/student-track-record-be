import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';

export class GuruQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'Cory' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'role' })
  @IsString()
  @IsOptional()
  role?: string;
}
