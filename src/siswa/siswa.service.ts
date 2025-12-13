import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siswa } from './siswa.entity';

@Injectable()
export class SiswaService {
  constructor(
    @InjectRepository(Siswa)
    private readonly siswaRepository: Repository<Siswa>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string, rombel?: string) {
    const queryBuilder = this.siswaRepository.createQueryBuilder('siswa');

    if (search) {
      queryBuilder.andWhere(
        '(siswa.nama ILIKE :search OR siswa.nipd ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (rombel) {
      queryBuilder.andWhere('siswa.rombel = :rombel', { rombel });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('siswa.nama', 'ASC');

    const [data, total] = await queryBuilder.getManyAndCount();

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
    const siswa = await this.siswaRepository.findOne({
      where: { id },
      relations: ['pelaporans', 'pelaporans.guru'],
      order: {
        pelaporans: {
          tanggal: 'DESC',
        },
      },
    });
    if (!siswa) {
      throw new NotFoundException(`Siswa with ID ${id} not found`);
    }
    return siswa;
  }

  async create(createSiswaDto: any) {
    const siswa = this.siswaRepository.create(createSiswaDto);
    return this.siswaRepository.save(siswa);
  }

  async update(id: string, updateSiswaDto: any) {
    const siswa = await this.findOne(id);
    this.siswaRepository.merge(siswa, updateSiswaDto);
    return this.siswaRepository.save(siswa);
  }

  async remove(id: string) {
    const siswa = await this.findOne(id);
    return this.siswaRepository.remove(siswa);
  }
}
