import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('assignment')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'task_id' })
  taskId: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'estimated_time', type: 'smallint', default: 6000 })
  estimatedTime: number;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'created_by', type: 'bigint' })
  createdById: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedById: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.assignments, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Task, (task) => task.assignments, { eager: true })
  @JoinColumn({ name: 'task_id' })
  task: Relation<Task>;

  @ManyToOne(() => User, (user) => user.assignmentsCreated, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (user) => user.assignmentsUpdated, { eager: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Relation<User>;
}
