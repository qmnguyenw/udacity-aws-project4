import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('logger-attachmentUtils')

// TODO: Implement the fileStorage logic
export class AttachmentUtils {
  constructor(
    private readonly s3Client = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly s3BucketName = process.env.S3_BUCKET_NAME,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async createAttachmentPresignedUrl(attachmentId: string): Promise<string> {
    logger.info('Creating presigned url')
    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: attachmentId,
      Expires: parseInt(this.urlExpiration)
    })
    logger.info(url)
    return url as string
  }

  async getAttachmentUrl(attachmentId: string): Promise<string> {
    const attachmentUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${attachmentId}`
    return attachmentUrl
  }

}
