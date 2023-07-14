import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MultimediaRepository } from './multimedia.repository';
import { Link } from '../../entities/link.entity';
import { extname } from 'path';
import { Environment } from '../../shared/constants/environment';
import { insertSucessful } from '../../shared/constants/messages';
import {
  CreateLinkDto,
  uploadMultimediaDto,
} from '../controller/dtos/create-link.dto';

@Injectable()
export class MultimediaService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private repo: MultimediaRepository,
  ) {}

  async saveMultimedia(
    files: Express.Multer.File[],
    data: uploadMultimediaDto,
    currentUserId: number,
  ) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        for (const file of files) {
          const payload = {
            url: file.filename,
            type: extname(file.filename).replace('.', ''),
            createdById: currentUserId,
            isPublic: data.isPublic,
            description: data.description,
          } as Link;

          const created = await this.repo.create(manager, payload);

          if (!created) throw new Error('Error al guardar recurso');
        }

        return insertSucessful('Recursos');
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    });
  }

  async saveMultimediaOnline(data: CreateLinkDto[]) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        for (const element of data) {
          const payload = {
            ...element,
            type: 'online',
          } as Link;

          const created = await this.repo.create(manager, payload);

          if (!created) throw new Error('Error al guardar recurso');
        }

        return insertSucessful('Recursos');
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    });
  }

  async getMultimedia(id: number) {
    try {
      const multimedia = await this.repo.getById(this.entityManager, id);

      if (!multimedia) throw new Error('Recurso no encontrado');

      return {
        buffer: await fs.readFileSync(
          `${Environment.PUBLIC_DIR}/${multimedia.url}`,
        ),
        name: multimedia.url,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getByUserAndPublic(id: number) {
    const multimedia = await this.repo.getByUserAndPublic(
      this.entityManager,
      id,
    );

    if (!multimedia)
      throw new NotFoundException('No se encontraron los recursos');

    return multimedia;
  }
}
