/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PageService } from './services/page/page.service';
import { HtmlService } from './services/html/html.service';
import { AwsModule } from 'src/aws/aws.module';
import { PdfGeneratorService } from './services/pdf-generator/pdf-generator.service';
import { PageDao } from './dao/pageDao';

@Module({
  imports: [AwsModule],
  providers: [PageService, HtmlService, PdfGeneratorService, PageDao],
  exports: [HtmlService, PageService, PdfGeneratorService],
})
export class PdfGeneratorModule {}
