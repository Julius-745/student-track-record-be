import { PartialType } from '@nestjs/swagger';
import { BaseSiswaDto } from './base-siswa.dto';

export class UpdateSiswaDto extends PartialType(BaseSiswaDto) {}
