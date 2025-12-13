import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PelaporanService } from './pelaporan.service';

@Controller('pelaporan')
export class PelaporanController {
  constructor(private readonly pelaporanService: PelaporanService) {}

  @Get()
  findAll() {
    return this.pelaporanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pelaporanService.findOne(id);
  }

  @Post()
  create(@Body() createPelaporanDto: any) {
    return this.pelaporanService.create(createPelaporanDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePelaporanDto: any) {
    return this.pelaporanService.update(id, updatePelaporanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pelaporanService.remove(id);
  }
}
