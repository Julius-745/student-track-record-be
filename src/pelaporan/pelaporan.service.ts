import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelaporan } from './pelaporan.entity';
import { Siswa } from '../siswa/siswa.entity';
import { Guru } from '../guru/guru.entity';

@Injectable()
export class PelaporanService {
  constructor(
    @InjectRepository(Pelaporan)
    private readonly pelaporanRepository: Repository<Pelaporan>,
    @InjectRepository(Siswa)
    private readonly siswaRepository: Repository<Siswa>,
    @InjectRepository(Guru)
    private readonly guruRepository: Repository<Guru>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string, jenis_pelaporan?: string) {
    const queryBuilder = this.pelaporanRepository
      .createQueryBuilder('pelaporan')
      .leftJoinAndSelect('pelaporan.siswa', 'siswa')
      .leftJoinAndSelect('pelaporan.guru', 'guru');

    if (search) {
      queryBuilder.andWhere(
        '(siswa.nama ILIKE :search OR guru.nama ILIKE :search OR pelaporan.deskripsi ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if(jenis_pelaporan){
      queryBuilder.andWhere('pelaporan.jenis_pelaporan = :jenis_pelaporan', { jenis_pelaporan });
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('pelaporan.created_at', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit) || 1,
        limit,
      },
    };
  }

  async findOne(id: string) {
    const pelaporan = await this.pelaporanRepository.findOne({
      where: { id },
      relations: ['siswa', 'guru'],
    });
    if (!pelaporan) {
      throw new NotFoundException(`Pelaporan with ID ${id} not found`);
    }
    return pelaporan;
  }

  async create(createDto: any) {
    const { siswa_id, guru_id, ...rest } = createDto;

    const siswa = await this.siswaRepository.findOne({
      where: { id: siswa_id },
    });
    if (!siswa) throw new NotFoundException(`Siswa ${siswa_id} not found`);

    // Guru is optional in some contexts but usually required for reporting
    let guru: Guru | null = null;
    if (guru_id) {
      guru = await this.guruRepository.findOne({ where: { id: guru_id } });
      if (!guru && guru_id)
        throw new NotFoundException(`Guru ${guru_id} not found`);
    }

    const pelaporan = this.pelaporanRepository.create({
      ...rest,
      siswa,
      guru,
    });

    return this.pelaporanRepository.save(pelaporan);
  }

  async update(id: string, updateDto: any) {
    const pelaporan = await this.findOne(id);

    // Handle relation updates if needed, for now just update basic fields
    this.pelaporanRepository.merge(pelaporan, updateDto);
    return this.pelaporanRepository.save(pelaporan);
  }

  async remove(id: string) {
    const pelaporan = await this.findOne(id);
    return this.pelaporanRepository.remove(pelaporan);
  }
}
