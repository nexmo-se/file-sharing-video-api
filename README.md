# File-Sharing Sample App with Vonage Video Api

Sample app that shows how to share files and images with Vonage Video API. It leverages an AWS S3 bucket to upload and download the files. The files URL are shared via [Signalling API](https://tokbox.com/developer/guides/signaling/js/). We will interact with AWS via [AWS SDK](https://www.npmjs.com/package/aws-sdk)

![Main](https://github.com/nexmo-se/file-sharing-video-api/blob/main/images/sample_file_sharing.png?raw=true)

## Architecture

There are several approaches to upload files to S3. One is server side and the other one is directly from the browser. I've decided to carry out the upload directly from the browser to avoid a high load on our server. Media uploads are typically large, so transferring files can represent a large share of network I/O and server CPU time. In order to make the upload and download secure, we're going to use signed URLs.

### File Upload

Our server side will act as a REST API handling signed URLs to carry out [putObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html) actions from the client side. You need to configure your AWS S3 bucket to allow CORS so that requests from your domain are allowed.

### File Download

The server will also generate download URls which are secure signed URLs that will expire after a given amount of time so that no one with the link can download the file after the set expiry time and so you don't have to make objects in your bucket public.

### Setup (Local)

1. clone this repo.
2. run `npm install`.
3. setup `.env` according to `.env.example`.
4. run `node server.js`.
5. run `npm start`
6. Navigate to `http://localhost:5000/video`.
