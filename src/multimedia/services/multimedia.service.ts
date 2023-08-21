import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import fs from 'fs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MultimediaRepository } from './multimedia.repository';
import { Link } from '@entities/link.entity';
import { extname } from 'path';
import { Environment } from '@shared/constants/environment';
import { updateFailed, updateSucessful } from '@shared/constants/messages';
import {
  CreateLinkDto,
  uploadMultimediaDto,
} from '../controllers/dtos/create-link.dto';
import { UpdateLinkDto } from '../controllers/dtos/update-link.dto';

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
        const ids: {
          id: number;
          title: string;
          url: string;
        }[] = [];

        for (const file of files) {
          const payload = {
            url: file.filename,
            type: extname(file.filename).replace('.', ''),
            createdById: currentUserId,
            isPublic: data.isPublic,
            description: data.description,
            title: data.title,
          } as Link;

          const created = await this.repo.create(manager, payload);

          if (!created) throw new Error('Error al guardar recurso');

          ids.push({ id: created.id, title: created.title, url: created.url });
        }

        return ids;
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    });
  }

  async saveMultimediaOnline(data: CreateLinkDto[]) {
    return await this.entityManager.transaction(async (manager) => {
      try {
        const ids: {
          id: number;
          title: string;
          url: string;
        }[] = [];

        for (const element of data) {
          const payload = {
            ...element,
            type: 'online',
          } as Link;

          const created = await this.repo.create(manager, payload);

          if (!created) throw new Error('Error al guardar recurso');

          ids.push({ id: created.id, title: created.title, url: created.url });
        }

        return ids;
      } catch (e) {
        throw new BadRequestException(e.message);
      }
    });
  }

  async getMultimedia(id: number) {
    try {
      const multimedia = await this.repo.getById(this.entityManager, id);

      const filePath = `${Environment.PUBLIC_DIR}/${multimedia.url}`;

      if (!multimedia) throw new Error('Recurso no encontrado');

      if (multimedia.type === 'online')
        throw new Error('Recurso no descargable');

      const exist = fs.existsSync(filePath);
      if (!exist) {
        await this.updateStatus(id);
        throw new Error('Recurso no disponible');
      }

      return {
        buffer: await fs.readFileSync(filePath),
        name: multimedia.url,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getByUserAndPublic(id: number, status: boolean) {
    const multimedia = await this.repo.getByUserAndPublic(
      this.entityManager,
      id,
      status,
    );

    if (!multimedia)
      throw new NotFoundException('No se encontraron los recursos');

    return multimedia;
  }

  async update(id: number, payload: UpdateLinkDto) {
    return await this.entityManager.transaction(async (manager) => {
      const file = await this.repo.getById(manager, id);

      if (!file) throw new NotFoundException('Recurso no encontrado');

      const updated = await this.repo.update(manager, id, payload as Link);

      if (!updated)
        throw new HttpException(
          updateFailed('Recurso'),
          HttpStatus.NOT_MODIFIED,
        );

      return updateSucessful('Recurso');
    });
  }

  async updateStatus(id: number) {
    return await this.entityManager.transaction(async (manager) => {
      const file = await this.repo.getById(manager, id);

      if (!file) throw new NotFoundException('Recurso no encontrado');

      const updated = await this.repo.update(manager, id, {
        status: !file.status,
      } as Link);

      if (!updated)
        throw new HttpException(
          updateFailed('Recurso'),
          HttpStatus.NOT_MODIFIED,
        );

      return updateSucessful('Recurso');
    });
  }
}