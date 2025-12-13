import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { GuruService } from './guru.service';

@Controller('guru')
export class GuruController {
  constructor(private readonly guruService: GuruService) {}

  @Get()
  findAll() {
    return this.guruService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guruService.findOne(id);
  }

  @Post()
  create(@Body() createGuruDto: any) {
    return this.guruService.create(createGuruDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGuruDto: any) {
    return this.guruService.update(id, updateGuruDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guruService.remove(id);
  }
}
