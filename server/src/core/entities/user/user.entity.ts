import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  recordId: number;

  @Column()
  name: string;

  @Column()
  project: string;

  @Column()
  role: string;

  @Column()
  company: string;
}
