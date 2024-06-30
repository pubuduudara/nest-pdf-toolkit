/* eslint-disable prettier/prettier */
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Page } from 'src/database/entities/Page';
import { DataSource, Repository } from 'typeorm';

export class PageDao {
  constructor(
    @InjectRepository(Page) private pageRepo: Repository<Page>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /**
   * Get all pages by user id
   * @param userId
   * @returns
   */
  async getPages(userId: string): Promise<Page[]> {
    const pageList: Page[] = await this.pageRepo.find({
      where: { userId },
      order: { date: 'DESC' },
    });
    return pageList;
  }
}
