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
  Req,
} from '@nestjs/common';
import { ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
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
  @Post('import')
  @ApiOperation({ summary: 'Import siswa from CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async import(@Req() req: FastifyRequest) {
    const data = await (
      req as FastifyRequest & { file: () => Promise<MultipartFile | undefined> }
    ).file();
    if (data) {
      const multipartFile = data;
      const buffer = await multipartFile.toBuffer();
      return this.siswaService.importCsv(buffer);
    }
    throw new Error('File not found');
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
