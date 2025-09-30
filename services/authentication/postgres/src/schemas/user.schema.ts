import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  phone: string | null;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  lastLogin: Date | null;

  @Column({ type: 'boolean', default: true })
  is2FAEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
