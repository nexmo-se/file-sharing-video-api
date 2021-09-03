const aws = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const bucketName = process.env.bucket;

const s3 = new aws.S3({
  region: process.env.region,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4'
});

async function getS3Url(uuid) {
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: uuid,
    Expires: 120
  });
  return url;
}

async function getObjectUrl(uuid) {
  let objectUrl = await s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: uuid,
    Expires: 600
  });
  return objectUrl;
}

module.exports = {
  getObjectUrl,
  getS3Url
};
