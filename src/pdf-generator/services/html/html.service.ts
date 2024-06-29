/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class HtmlService {
  /**
   * get html image tempalte
   * @param imageUrl
   * @param imageName
   * @returns
   */
  getHtmlImageTemplate(imageName: string, imageUrl: string): string {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${imageName}</title>
</head>
<body>
    <img src="${imageUrl}" alt="${imageName}" />
</body>
</html>
    `;
    return htmlContent;
  }
}
