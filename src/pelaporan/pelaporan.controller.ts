import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PelaporanService } from './pelaporan.service';

@UseGuards(JwtAuthGuard)
@Controller('pelaporan')
export class PelaporanController {
  constructor(private readonly pelaporanService: PelaporanService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.pelaporanService.findAll(Number(page), Number(limit), search);
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
