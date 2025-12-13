import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guru } from './guru.entity';

@Injectable()
export class GuruService {
  constructor(
    @InjectRepository(Guru)
    private readonly guruRepository: Repository<Guru>,
  ) {}

  findAll() {
    return this.guruRepository.find();
  }

  async findOne(id: string) {
    const guru = await this.guruRepository.findOne({ where: { id } });
    if (!guru) {
      throw new NotFoundException(`Guru with ID ${id} not found`);
    }
    return guru;
  }

  async findByEmail(email: string) {
    return this.guruRepository.findOne({ where: { email } });
  }

  async create(createGuruDto: any) {
    const guru = this.guruRepository.create(createGuruDto);
    return this.guruRepository.save(guru);
  }

  async update(id: string, updateGuruDto: any) {
    const guru = await this.findOne(id);
    this.guruRepository.merge(guru, updateGuruDto);
    return this.guruRepository.save(guru);
  }

  async remove(id: string) {
    const guru = await this.findOne(id);
    return this.guruRepository.remove(guru);
  }
}
