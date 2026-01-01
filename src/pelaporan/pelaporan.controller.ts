import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PelaporanService } from './pelaporan.service';
import { CreatePelaporanDto } from './dto/create-pelaporan.dto';
import { UpdatePelaporanDto } from './dto/update-pelaporan.dto';
import { PelaporanQueryDto } from './dto/pelaporan-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('pelaporan')
export class PelaporanController {
  constructor(private readonly pelaporanService: PelaporanService) {}

  @Get()
  findAll(@Query() query: PelaporanQueryDto) {
    return this.pelaporanService.findAll(query.page, query.limit, query.search, query.jenis_pelaporan);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pelaporanService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePelaporanDto) {
    return this.pelaporanService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePelaporanDto) {
    return this.pelaporanService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pelaporanService.remove(id);
  }
}
