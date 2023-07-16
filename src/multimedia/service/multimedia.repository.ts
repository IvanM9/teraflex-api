import { Brackets, EntityManager } from 'typeorm';
import { Link } from '../../entities/link.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MultimediaRepository {
  async create(cnx: EntityManager, payload: Link) {
    const obj = cnx.create(Link, payload);
    return await cnx.save(obj);
  }

  async getById(cnx: EntityManager, id: number) {
    return await cnx.findOneBy(Link, { id });
  }

  async getByUserAndPublic(cnx: EntityManager, id: number, status?: boolean) {
    return await cnx
      .createQueryBuilder()
      .select([
        'link.id as id',
        'link.url as url',
        'link.type as type',
        'link.isPublic as "isPublic"',
        'link.description as description',
        'link.createdAt as "createdAt"',
        'link.updatedAt as "updatedAt"',
      ])
      .from(Link, 'link')
      .where(
        new Brackets((qb) => {
          qb.where('link.createdById = :id', { id }).andWhere(
            'link.isPublic = :isPublic',
            { isPublic: true },
          );
        }),
      )
      .andWhere('link.status = :status', { status: status ?? true })
      .getRawMany();
  }

  async update(cnx: EntityManager, id: number, payload: Link) {
    return await cnx.update(Link, { id }, payload);
  }
}