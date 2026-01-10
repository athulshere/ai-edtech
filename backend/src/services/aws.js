const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');

class AWSService {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    this.bucketName = process.env.AWS_S3_BUCKET;
  }

  async uploadImage(file, studentId, assessmentId) {
    try {
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname);
      const fileName = `assessments/${studentId}/${assessmentId}/${timestamp}${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          studentId: studentId.toString(),
          assessmentId: assessmentId.toString(),
          uploadedAt: new Date().toISOString()
        }
      });

      await this.s3Client.send(command);

      const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

      return {
        success: true,
        url: url,
        key: fileName,
        bucket: this.bucketName
      };
    } catch (error) {
      console.error('AWS S3 Upload Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      return {
        success: true,
        url
      };
    } catch (error) {
      console.error('AWS S3 Signed URL Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteImage(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);

      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      console.error('AWS S3 Delete Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getImage(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const response = await this.s3Client.send(command);

      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      const data = Buffer.concat(chunks);

      return {
        success: true,
        data: data,
        contentType: response.ContentType
      };
    } catch (error) {
      console.error('AWS S3 Get Object Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async listStudentImages(studentId) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: `assessments/${studentId}/`
      });

      const response = await this.s3Client.send(command);

      return {
        success: true,
        images: (response.Contents || []).map(item => ({
          key: item.Key,
          size: item.Size,
          lastModified: item.LastModified
        }))
      };
    } catch (error) {
      console.error('AWS S3 List Objects Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new AWSService();
