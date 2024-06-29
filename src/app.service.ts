/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PageService } from './pdf-generator/services/page/page.service';
import { HtmlService } from './pdf-generator/services/html/html.service';
import { PdfGeneratorService } from './pdf-generator/services/pdf-generator/pdf-generator.service';
import { PageDto } from './pdf-generator/dto/PageDto';
import { OUTPUT_FOLDER } from './constants';

@Injectable()
export class AppService {
  constructor(
    private pageService: PageService,
    private htmlService: HtmlService,
    private pdfGenerateService: PdfGeneratorService,
  ) {}

  async createPdf(userId: string) {
    try {
      const pages: PageDto[] = await this.pageService.getPagesByUserId(userId);
      const pdfPagesLocalPaths: string[] = [];
      for (const page of pages) {
        const htmlImageTemplate: string = this.htmlService.getHtmlImageTemplate(
          page.imageName,
          page.imageUrl,
        );
        const pdfPagePath = await this.pdfGenerateService.generatePdfFromHtml(
          page.imageName,
          htmlImageTemplate,
          `${OUTPUT_FOLDER}/${userId}`,
        );
        pdfPagesLocalPaths.push(pdfPagePath);
      }

      // merge pdfs to a single pdf
      const mergedPdfLocalPath = await this.pdfGenerateService.mergePdfs(
        pdfPagesLocalPaths,
        `${OUTPUT_FOLDER}/${userId}`,
        userId,
      );
    } catch (error) {
      console.log(`Failed to create pdf. Error: ${error}`);
    }
  }
}
