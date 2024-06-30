/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PageService } from './services/page/page.service';
import { HtmlService } from './services/html/html.service';
import { AwsModule } from 'src/aws/aws.module';
import { PdfGeneratorService } from './services/pdf-generator/pdf-generator.service';
import { PageDao } from './dao/pageDao';
import { Page } from 'src/database/entities/Page';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Page]), AwsModule],
  providers: [PageService, HtmlService, PdfGeneratorService, PageDao],
  exports: [HtmlService, PageService, PdfGeneratorService],
})
export class PdfGeneratorModule {}
