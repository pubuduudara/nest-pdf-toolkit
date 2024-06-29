/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'pages' })
export class Page {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  headline: string;

  @Column()
  subheading: string;

  @Column()
  date: Date;

  @Column({ name: 'image_name' })
  imageName: string;

  @Column({ name: 'default_page_id' })
  defaultPageId: string;

  @Column()
  orientation: string;

  @Column()
  type: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
