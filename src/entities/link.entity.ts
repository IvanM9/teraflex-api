import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MultimediaType } from './multimedia-type.entity';
import { TaskMultimedia } from './task-multimedia.entity';
import { User } from './user.entity';

@Entity('link')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character varying' })
  url: string;

  @Column({ type: 'character varying', nullable: true })
  description: string;

  @Column({ type: 'character varying', nullable: true })
  isPublic: boolean;

  @Column({ name: 'multimedia_type' })
  multimediaTypeId: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'created_by', type: 'bigint' })
  createdById: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedById: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => MultimediaType, (multimediaType) => multimediaType.links, {
    eager: true,
  })
  @JoinColumn({ name: 'multimedia_type' })
  multimediaType: MultimediaType;

  @OneToMany(() => TaskMultimedia, (taskMultimedia) => taskMultimedia.link)
  tasksMultimedia: TaskMultimedia[];

  @ManyToOne(() => User, (user) => user.linksCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.linksUpdated)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;
}
