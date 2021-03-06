// var AWS = require('aws-sdk');
// const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const express = require('express');

const port = process.env.SERVER_PORT || process.env.PORT || 5000;
const bodyParser = require('body-parser');

const app = express(); // create express app
app.use(cors());
// app.use('/index', express.static(path.join(__dirname, './index.html')));
app.use(express.static(__dirname + '/src'));
app.use('/dist', express.static('dist'));
app.use('/video', express.static(path.join(__dirname, './index.html')));
const { getCredentials, generateToken } = require('./services/opentok');
const { getObjectUrl, getS3Url } = require('./services/s3');

app.use(bodyParser.json());

const sessions = {};

app.get('/session/:room', async (req, res) => {
  try {
    const { room: roomName } = req.params;
    console.log(sessions);
    if (sessions[roomName]) {
      const data = generateToken(sessions[roomName]);
      res.json({
        sessionId: sessions[roomName],
        token: data.token,
        apiKey: data.apiKey
      });
    } else {
      const data = await getCredentials();
      sessions[roomName] = data.sessionId;
      res.json({
        sessionId: data.sessionId,
        token: data.token,
        apiKey: data.apiKey
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/api/signed-url/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const url = await getS3Url(uuid);
    console.log('getting signed url ' + url);
    if (url) {
      res.json({ url: url });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: e.message });
  }
});

app.get('/api/download-url/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const url = await getObjectUrl(uuid);
    console.log('getting download url ' + url);
    if (url) {
      res.json({ url: url });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: e.message });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
