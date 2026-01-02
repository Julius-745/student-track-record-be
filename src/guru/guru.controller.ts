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
import { UpdateGuruDto } from './dto/update-guru.dto';
import { CreateGuruDto } from './dto/create-guru.dto';
import { GuruQueryDto } from './dto/guru-query.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GuruService } from './guru.service';
import { RolesGuard } from 'src/auth/roles.guard';

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

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGuruDto) {
    return this.guruService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guruService.remove(id);
  }
}
