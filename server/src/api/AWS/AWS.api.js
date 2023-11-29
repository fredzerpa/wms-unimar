require('dotenv').config();
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const AWS_S3_CLIENT = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const UPLOAD_CONFIG = {
  filePath: '', // Nombre completo (incluyendo la ruta) del archivo. Ex: 'el-angel-2023-01-01'
  keyName: '', // Reenombra el archivo al guardarse en el bucket (incluye las extensiones '.gz, .gzip, .txt, .json')
  bucketName: '', // Nombre del S3 Bucket
}

const uploadFileToBucket = async (config = UPLOAD_CONFIG, options = { ContentEncoding: '', ContentType: '', ACL: '' }) => {
  const uploadConfig = { ...UPLOAD_CONFIG, ...config };

  const command = new PutObjectCommand({
    Bucket: uploadConfig.bucketName, // Nombre del bucket
    Key: uploadConfig.keyName, // Nombre del archivo al guardarse en el bucket
    Body: uploadConfig.filePath, // Archivo o data que se guardara en el bucket
    ...options
  });

  try {
    const response = await AWS_S3_CLIENT.send(command);
    return {
      ok: response.$metadata.httpStatusCode >= 200 && response.$metadata.httpStatusCode <= 300,
      file: uploadConfig.keyName,
      response,
    }
  } catch (err) {
    return {
      ok: false,
      error: err,
      message: err.message
    }
  }
}

const DELETE_CONFIG = {
  keyName: '', // Reenombra el archivo al guardarse en el bucket (incluye las extensiones '.gz, .gzip, .txt, .json')
  bucketName: '', // Nombre del S3 Bucket
}

const deleteFileFromBucket = async (config = DELETE_CONFIG) => {
  const deleteConfig = { ...DELETE_CONFIG, ...config };

  const command = new DeleteObjectCommand({
    Bucket: deleteConfig.bucketName, // Nombre del bucket
    Key: deleteConfig.keyName, // Nombre del archivo al guardarse en el bucket
  });

  try {
    const response = await AWS_S3_CLIENT.send(command);
    return {
      ok: response.$metadata.httpStatusCode >= 200 && response.$metadata.httpStatusCode <= 300,
      file: deleteConfig.keyName,
      response,
    }
  } catch (err) {
    return {
      ok: false,
      error: err,
      message: err.message
    }
  }
}

module.exports = {
  uploadFileToBucket,
  deleteFileFromBucket
}