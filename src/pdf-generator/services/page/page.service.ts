/* eslint-disable prettier/prettier */
import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/aws/services/s3/s3.service';
import { S3_FOLDERS, S3_OPERATIONS } from 'src/constants';
import { Page } from 'src/database/entities/Page';
import { PageDao } from 'src/pdf-generator/dao/pageDao';
import { PageDto } from 'src/pdf-generator/dto/PageDto';

@Injectable()
export class PageService {
  constructor(
    private pageDao: PageDao,
    private s3Service: S3Service,
  ) {}

  /**
   * Get all pages by user id
   * @param userId
   * @returns
   */
  async getPagesByUserId(userId: string): Promise<PageDto[]> {
    // get all user pages
    const pageList: Page[] = await this.pageDao.getPages(userId);
    // attach image url to each page
    const pageDtoList: PageDto[] = plainToClass(PageDto, pageList);
    const s3FolderPath = `${S3_FOLDERS.COVER_IMAGES}/${userId}`;
    for (const page of pageDtoList) {
      const imageUrl = await this.s3Service.getPreSignedUrl(
        process.env.S3_BUCKET,
        s3FolderPath,
        page.imageName,
        S3_OPERATIONS.GET_OBJECT,
      );
      page.imageUrl = imageUrl;
    }
    return pageDtoList;
  }
}
