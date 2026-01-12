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
    const results: Record<string, any>[] = [];
    const parser = Readable.from(fileBuffer).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        relax_quotes: true,
      }),
    );

    for await (const record of parser) {
      results.push(record as Record<string, any>);
    }

    const batchSize = 100;
    const entities = results.map((record) => {
      // Exclude ID to allow auto-generation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...siswaData } = record;

      // Clean up empty strings to null for optional fields
      Object.keys(siswaData).forEach((key) => {
        if (siswaData[key] === '') {
          siswaData[key] = null;
        }
      });

      return siswaData as Siswa;
    });

    // Save in batches
    const savedEntities: Siswa[] = [];
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      const savedBatch = await this.siswaRepository.save(batch);
      savedEntities.push(...savedBatch);
    }

    return savedEntities;
  }

  downloadTemplate() {
    const csvHeader = [
      'rombel',
      'nama',
      'nipd',
      'jenis_kelamin',
      'nisn',
      'tempat_lahir',
      'tanggal_lahir',
      'nik',
      'agama',
      'alamat',
      'rt',
      'rw',
      'dusun',
      'kelurahan',
      'kecamatan',
      'kode_pos',
      'jenis_tinggal',
      'alat_transportasi',
      'no_hp',
      'email',
      'skhun',
      'penerima_kps',
      'no_kps',
    ].join(',');
    return Readable.from([csvHeader]);
  }
}
