require('dotenv').config();
const Minio = require('minio');



const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET_NAME = process.env.MINIO_BUCKET;

minioClient.bucketExists(BUCKET_NAME, (err) => {
  console.log(BUCKET_NAME);
  if (err) {
    if (err.code === 'NoSuchBucket') {
      minioClient.makeBucket(BUCKET_NAME, '', (err) => {
        if (err) return console.log('Error creating bucket.', err);
        console.log(`Bucket '${BUCKET_NAME}' created successfully.`);
      });
    } else {
      console.log('Error checking bucket existence:', err);
    }
  } else {
    console.log(`Bucket '${BUCKET_NAME}' already exists.`);
  }
});

module.exports = { minioClient, BUCKET_NAME };
