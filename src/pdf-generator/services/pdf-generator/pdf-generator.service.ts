/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
@Injectable()
export class PdfGeneratorService {
  /**
   * generate pdf from a given html
   * @param imageName
   * @param htmlContent
   * @param outputFolder
   * @returns
   */
  async generatePdfFromHtml(
    imageName: string,
    htmlContent: string,
    outputFolder: string,
  ) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      timeout: 0, // No timeout
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Wait for the image to load completely
    await page.waitForSelector('img', { visible: true, timeout: 30000 }); // 30 seconds timeout
    const pdfPath = path.join(outputFolder, `${imageName}.pdf`);

    //create folder structure
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
    await page.pdf({ path: pdfPath, format: 'A4' });
    await browser.close();
    return pdfPath;
  }

  async mergePdfs(
    pdfLocations: string[],
    outputDir: string,
    userId: string,
  ): Promise<string> {
    const mergedPdf = await PDFDocument.create();
    for (const location of pdfLocations) {
      const loadedPdf = await PDFDocument.load(fs.readFileSync(location));
      const copiedPages = await mergedPdf.copyPages(
        loadedPdf,
        loadedPdf.getPageIndices(),
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfPath = `${outputDir}/${path.parse(userId).name}.pdf`;
    fs.writeFileSync(pdfPath, await mergedPdf.save());
    return pdfPath;
  }
}
