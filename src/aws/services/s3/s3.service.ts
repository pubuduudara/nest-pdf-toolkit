/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
@Injectable()
export class S3Service {
  private LINK_EXPIRATION_DURATION = 3000;
  private readonly logger = new Logger(S3Service.name);

  private s3Client = new S3({
    signatureVersion: 'v4',
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  /**
   * get S3 pre-signed URL to get image
   * @param {*} bucketName
   * @param {*} folder
   * @param {*} fileName
   * @param {*} operation
   */
  async getPreSignedUrl(
    bucketName: string,
    folder: string,
    fileName: string,
    operation: string,
  ) {
    const params = {
      Bucket: bucketName,
      Key: `${folder}/${fileName}`,
      Expires: this.LINK_EXPIRATION_DURATION,
    };
    return this.s3Client.getSignedUrl(operation, params);
  }

  /**
   * copy image from source key to destination key in the same bucket
   * @param sourceKey
   * @param destinationKey
   * @param bucketName
   */
  async copyToFolder(
    sourceKey: string,
    destinationKey: string,
    bucketName: string,
  ) {
    try {
      const copyParams = {
        Bucket: bucketName,
        CopySource: `${bucketName}/${sourceKey}`,
        Key: `${destinationKey}`,
      };
      await this.s3Client.copyObject(copyParams).promise();
    } catch (error) {
      throw new error(`Failed in copyToFolder`);
    }
  }

  /**
   * delete file in the bucket
   * @param bucketName
   * @param folder
   * @param fileName
   */
  async deleteFile(
    bucketName: string,
    folder: string,
    fileName: string,
  ): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: `${folder}/${fileName}`,
    };
    try {
      await this.s3Client.deleteObject(params).promise();
    } catch (error) {
      throw new error(`Failed to deleteFile ${fileName} in ${folder} folder`);
    }
  }

  /**
   * get S3 pre-signed URL to get image
   * @param {*} bucketName
   * @param {string} localFilePath - The local file path
   * @param {string} [s3Key] - The key (path) to save the file in S3 bucket (optional)
   */
  async uploadFile(bucketName: string, localFilePath: string, s3Key: string) {
    const fileContent = fs.readFileSync(localFilePath);

    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent,
    };
    try {
      await this.s3Client.upload(params).promise();
    } catch (error) {
      throw error;
    }
  }
}
