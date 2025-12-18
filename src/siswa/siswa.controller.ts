import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { SiswaService } from './siswa.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('rombel') rombel?: string,
  ) {
    return this.siswaService.findAll(Number(page), Number(limit), search, rombel);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siswaService.findOne(id);
  }

  @Post()
  create(@Body() createSiswaDto: any) {
    return this.siswaService.create(createSiswaDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSiswaDto: any) {
    return this.siswaService.update(id, updateSiswaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siswaService.remove(id);
  }
}
