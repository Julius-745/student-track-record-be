import { PartialType } from '@nestjs/swagger';
import { BasePelaporanDto } from './base-pelaporan.dto';

export class UpdatePelaporanDto extends PartialType(BasePelaporanDto) {}
