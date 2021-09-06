# file-sharing-video-api

Sample app that shows how to share files and images with Vonage Video API. It leverages an AWS S3 bucket to upload and download the files. The files URL are shared via [Signalling API](https://tokbox.com/developer/guides/signaling/js/)

![Main](https://github.com/nexmo-se/file-sharing-video-api/blob/main/images/sample_file_sharing.png?raw=true)

### Architecture

### Setup (Local)

1. clone this repo.
2. run `npm install`.
3. setup `.env` according to `.env.example`.
4. run `node server.js`.
5. run `npm start`
6. Navigate to `http://localhost:5000/video`.
