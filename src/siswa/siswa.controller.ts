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
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { SiswaService } from './siswa.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';
import { SiswaQueryDto } from './dto/siswa-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Get()
  findAll(@Query() query: SiswaQueryDto) {
    return this.siswaService.findAll(
      query.page,
      query.limit,
      query.search,
      query.rombel,
      query.orderBy,
      query.order,
    );
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siswaService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateSiswaDto) {
    return this.siswaService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSiswaDto) {
    return this.siswaService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siswaService.remove(id);
  }
}
