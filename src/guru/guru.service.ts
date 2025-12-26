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

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const queryBuilder = this.guruRepository.createQueryBuilder('guru');

    if (search) {
      queryBuilder.andWhere(
        '(guru.nama ILIKE :search OR guru.nipd ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('guru.nama', 'ASC');

    const [data, total] = await queryBuilder.getManyAndCount();

    if (data.length === 0) {
      throw new NotFoundException('No Guru found matching the criteria');
    }

    if (total === 0) {
      throw new NotFoundException('No Guru found');
    }

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
        limit,
      },
    };
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
