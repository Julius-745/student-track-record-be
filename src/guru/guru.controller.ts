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
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MultipartFile } from '@fastify/multipart';
import type { FastifyRequest } from 'fastify';
import { UpdateGuruDto } from './dto/update-guru.dto';
import { CreateGuruDto } from './dto/create-guru.dto';
import { GuruQueryDto } from './dto/guru-query.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GuruService } from './guru.service';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('guru')
export class GuruController {
  constructor(private readonly guruService: GuruService) {}

  @Get()
  findAll(@Query() query: GuruQueryDto) {
    return this.guruService.findAll(
      query.page,
      query.limit,
      query.search,
      query.role,
      query.orderBy,
      query.order,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guruService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGuruDto) {
    return this.guruService.create(dto);
  }

  @Post('import')
  @ApiOperation({ summary: 'Import guru from CSV file' })
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
      return this.guruService.importCsv(buffer);
    }
    throw new Error('File not found');
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGuruDto) {
    return this.guruService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guruService.remove(id);
  }

  @Get('template/download')
  @ApiOperation({ summary: 'Download template CSV for Guru import' })
  downloadTemplate(@Res({ passthrough: true }) res: Response) {
    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename="template_guru.csv"',
    );
    return new StreamableFile(this.guruService.downloadTemplate());
  }
}
