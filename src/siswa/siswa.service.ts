import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Siswa } from './siswa.entity';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { CreateSiswaDto } from './dto/create-siswa.dto';
import { UpdateSiswaDto } from './dto/update-siswa.dto';

@Injectable()
export class SiswaService {
  constructor(
    @InjectRepository(Siswa)
    private readonly siswaRepository: Repository<Siswa>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    rombel?: string,
    orderBy: string = 'nama',
    order: 'ASC' | 'DESC' = 'ASC',
  ) {
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

    // Ensure orderBy is prefixed with 'siswa.' if not already
    const sortField = orderBy.includes('.') ? orderBy : `siswa.${orderBy}`;

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(sortField, order);

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

  async create(createSiswaDto: CreateSiswaDto) {
    const siswa = this.siswaRepository.create(createSiswaDto);
    return this.siswaRepository.save(siswa);
  }

  async update(id: string, updateSiswaDto: UpdateSiswaDto) {
    const siswa = await this.findOne(id);
    this.siswaRepository.merge(siswa, updateSiswaDto);
    return this.siswaRepository.save(siswa);
  }

  async remove(id: string) {
    const siswa = await this.findOne(id);
    return this.siswaRepository.remove(siswa);
  }

  async importCsv(fileBuffer: Buffer) {
    const results: any[] = [];
    const parser = Readable.from(fileBuffer).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }),
    );

    for await (const record of parser) {
      results.push(record);
    }

    const entities = results.map((record) => {
      // Map CSV headers to entity fields if necessary
      // For now, assume CSV headers match entity fields
      return record as Siswa;
    });

    return this.siswaRepository.save(entities);
  }
}
