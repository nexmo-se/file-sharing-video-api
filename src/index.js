import { getResizedCanvasFromImage } from './resizedCanvas';
import { getCredentials } from './api';
import {
  getURLForUpload,
  uploadFile,
  getDownloadUrl,
  toggleSidebar,
  addSenderBubble,
  generateDownloadButton,
  generateIconButton,
  getFileIconName
} from './utils';
import { v4 as uuidv4 } from 'uuid';

const roomName = 'test';

window.addEventListener('load', event => {
  const fileSelect = document.getElementById('fileSelect'),
    fileElem = document.getElementById('fileElem'),
    fileList = document.getElementById('fileList'),
    chat = document.getElementById('chat'),
    message = document.getElementById('file'),
    sideBarToggler = document.getElementById('button-expand-sidebar');
  let session;
  let publisherObject;
  getCredentials(roomName)
    .then(({ data }) => {
      initSession(data);
    })
    .catch(err => {
      console.log(err);
    });

  const initSession = ({ apiKey, sessionId, token }) => {
    session = OT.initSession(apiKey, sessionId);
    setUpEventListeners();
    connectAndPublish(token);
  };

  sideBarToggler.addEventListener('click', () => {
    toggleSidebar();
  });

  fileSelect.addEventListener(
    'click',
    function(e) {
      //   console.log(e);
      if (fileElem) {
        fileElem.click();
      }
      e.preventDefault(); // prevent navigation to "#"
    },
    false
  );
  function setUpEventListeners() {
    session.on('signal:image', function(event) {
      console.log(event);
      const sender = messageSender(event.from.connectionId);
      const image = new Image();
      image.src = 'data:image/png;base64,' + event.data.image;
      const downloadableImage = generateDownloadDiv();
      const downloadButton = generateDownloadButton(
        event.data.downloadUrl.url.toString()
      );

      const bubble = addSenderBubble(sender);
      chat.appendChild(bubble);
      downloadableImage.appendChild(image);
      chat.appendChild(downloadableImage);
      downloadableImage.insertAdjacentHTML('beforeend', downloadButton);
    });
    session.on('signal:file', function(event) {
      console.log(event);
      const sender = messageSender(event.from.connectionId);
      const downloadableFile = generateDownloadDiv();
      const downloadButton = generateDownloadButton(
        event.data.downloadUrl.url.toString()
      );
      const fileIcon = generateIconButton(event.data.icon);

      const bubble = addSenderBubble(sender);
      chat.appendChild(bubble);
      chat.appendChild(downloadableFile);

      downloadableFile.insertAdjacentHTML('afterbegin', fileIcon);
      downloadableFile.insertAdjacentHTML('beforeend', downloadButton);
    });
    session.on('signal:text', function(event) {
      // console.log(event);
      const sender = messageSender(event.from.connectionId);

      addChatMessage(sender, event.data);
    });
    session.on('streamCreated', function(event) {
      session.subscribe(
        event.stream,
        'subscriber',
        {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        },
        handleError
      );
    });
  }

  const messageSender = connection => {
    if (connection === session.connection.connectionId) return 'me';
    else return 'Participant';
  };
  const generateDownloadDiv = () => {
    const downloadableFile = document.createElement('div');
    downloadableFile.style.display = 'flex';
    downloadableFile.style.flexDirection = 'row';
    downloadableFile.style.alignItems = 'center';
    downloadableFile.style.justifyContent = 'space-evenly';
    return downloadableFile;
  };

  fileElem.addEventListener('change', function(event) {
    // console.log(event);
    event.preventDefault();
    handleFiles(event.target.files);
  });

  document.getElementById('chat').addEventListener('drop', function(e) {
    e.preventDefault();
    console.log('dropped something');
    getFilesFromDragAndDropEvent(e);
  });

  document.getElementById('chat').addEventListener('dragover', function(e) {
    e.preventDefault();
  });

  function allowDrop(event) {
    event.preventDefault();
  }

  const sendSignal = (data, type) => {
    console.log(data);
    session.signal(
      {
        data: data,
        type: type
      },
      function(error) {
        if (error) {
          console.log('signal error (' + error.name + '): ' + error.message);
        } else {
          console.log('signal sent.');
        }
      }
    );
  };

  function getFilesFromDragAndDropEvent(event) {
    // event.preventDefault();
    // Convert FileList object to Array. It's easier to work with
    const files = [];
    for (let index = 0; index < event.dataTransfer.files.length; index++) {
      const file = event.dataTransfer.files[index];
      const item = event.dataTransfer.items[index];
      file.isDirectory = item.webkitGetAsEntry().isDirectory;
      files.push(file);
    }
    handleFiles(files);

    return files;
  }

  async function getImageThumbnail(attachment) {
    const canvas = await getResizedCanvasFromImage(attachment, 120, 40, 120);
    const thumbnail = canvas
      .toDataURL('image/jpeg', 0.92)
      .split(',')
      .pop();
    return thumbnail;
  }

  function handleError(error) {
    console.log(error);
  }

  function connectAndPublish(token) {
    session.connect(token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        handleError(error);
      } else {
        var publisher = OT.initPublisher('publisher', {
          insertMode: 'append',
          width: '100%',
          height: '100%',
          publishAudio: false
        });
        publisherObject = session.publish(publisher);
      }
    });
  }

  const addChatMessage = (sender, text) => {
    const chatMessage = document.createElement('div');
    chatMessage.innerHTML = text;
    const bubble = addSenderBubble(sender);
    chat.appendChild(bubble);
    chat.appendChild(chatMessage);
  };

  message.addEventListener('keyup', function(event) {
    //console.log(event);
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      // event.preventDefault();
      sendSignal(event.target.value, 'text');
      event.target.value = '';
    }
  });

  async function handleFiles(files) {
    // chat.innerHTML = '';
    console.log(files[0]);
    console.log('getting signedURL');

    const uuid = uuidv4();
    try {
      const { url } = await getURLForUpload(uuid);
      await uploadFile(url, files[0]);
      const downloadUrl = await getDownloadUrl(uuid);
      console.log(downloadUrl);
      if (isImage(files[0])) {
        try {
          const image = await getImageThumbnail(files[0]);
          sendSignal({ image, downloadUrl }, 'image');
        } catch (e) {
          console.log(e);
        }
      } else {
        const icon = getFileIconName(files[0]);
        sendSignal({ downloadUrl, icon }, 'file');
      }
    } catch (e) {
      console.log(e);
    }
  }

  const isImage = file => {
    console.log(file);
    return file.type.startsWith('image');
  };
});
