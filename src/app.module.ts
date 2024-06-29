/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AwsModule } from './aws/aws.module';
import { PdfGeneratorModule } from './pdf-generator/pdf-generator.module';
import { Page } from './database/entities/Page';
import { PdfGeneratorStatus } from './database/entities/PdfGeneratorStatus';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Page, PdfGeneratorStatus],
      synchronize: false,
    }),
    AwsModule,
    PdfGeneratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
