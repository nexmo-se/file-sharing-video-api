import { getResizedCanvasFromImage } from './resizedCanvas';
import { getCredentials } from './api';
import {
  getURLForUpload,
  uploadFile,
  getDownloadUrl,
  toggleSidebar,
  addSenderBubble
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
      const sender =
        event.from.connectionId === session.connection.connectionId
          ? 'Me'
          : 'Participant';
      const image = new Image();
      image.src = 'data:image/png;base64,' + event.data.image;
      // chat.appendChild(image);
      const downloadableImage = document.createElement('div');
      downloadableImage.style.display = 'flex';
      downloadableImage.style.flexDirection = 'row';
      downloadableImage.style.alignItems = 'center';
      const downloadButton = document.createElement('button');
      downloadButton.classList.add(
        'downloadButton',
        'Vlt-btn',
        'Vlt-btn--tertiary',
        'Vlt-btn--icon'
      );
      downloadButton.innerHTML =
        '<svg><use xlink:href="./src/volta-icons.svg#Vlt-icon-download-full" /></svg>';
      downloadButton.onclick = () => {
        const aElement = document.createElement('a');
        aElement.href = event.data.downloadUrl.url;
        aElement.download = 'image';
        aElement.click();
      };
      const bubble = addSenderBubble(sender);
      chat.appendChild(bubble);
      downloadableImage.appendChild(image);
      downloadableImage.appendChild(downloadButton);
      chat.appendChild(downloadableImage);
    });
    session.on('signal:file', function(event) {
      console.log(event);
      const sender =
        event.from.connectionId === session.connection.connectionId
          ? 'Me'
          : 'Participant';

      const downloadableFile = document.createElement('div');
      downloadableFile.style.display = 'flex';
      downloadableFile.style.flexDirection = 'row';
      const pdfIcon = document.createElement('button');
      downloadableFile.style.alignItems = 'center';
      pdfIcon.innerHTML =
        '<svg><use xlink:href="./src/volta-icons.svg#Vlt-icon-file-pdf" /></svg>';
      const downloadButton = document.createElement('button');
      // downloadButton.classList.add(
      //   'downloadButton',
      //   'Vlt-btn',
      //   'Vlt-btn--tertiary',
      //   'Vlt-btn--icon'
      // );
      downloadButton.innerHTML =
        '<svg><use xlink:href="./src/volta-icons.svg#Vlt-icon-download-full" /></svg>';
      downloadButton.onclick = () => {
        const aElement = document.createElement('a');
        aElement.href = event.data.downloadUrl.url;
        aElement.download = 'file';
        aElement.click();
      };
      const bubble = addSenderBubble(sender);
      chat.appendChild(bubble);
      downloadableFile.appendChild(pdfIcon);
      downloadableFile.appendChild(downloadButton);
      chat.appendChild(downloadableFile);

      // addChatMessage(sender, event.data);
    }),
      session.on('signal:text', function(event) {
        console.log(event);
        const sender =
          event.from.connectionId === session.connection.connectionId
            ? 'Me'
            : 'Participant';
        addChatMessage(sender, event.data);
      }),
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

  fileElem.addEventListener('change', function(event) {
    console.log(event);
    event.preventDefault();
    handleFiles(event.target.files);
  });

  document.getElementById('chat').addEventListener('drop', function(e) {
    e.preventDefault();
    const dropZoneCounter = 0;
    console.log('dropped something');
    getFilesFromDragAndDropEvent(e);
    // getURLForUpload();
  });

  document.getElementById('chat').addEventListener('dragover', function(e) {
    e.preventDefault();
  });

  // document.getElementById('chat').addEventListener('dragover', function(e) {
  //   e.preventDefault();
  // });

  // document.getElementById('chat').addEventListener('dragend', function(e) {
  //   allowDrop(e);
  // });
  // document.getElementById('chat').addEventListener('dragenter', function(e) {
  //   allowDrop(e);
  // });

  // document.getElementById('file').addEventListener('dragover', function(e) {
  //   allowDrop(e);
  // });

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

    // getSmallerImage(files[0]).then(data => sendSignal(data, 'file'));
    // console.log(thumbNail);
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
          height: '100%'
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
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      sendSignal(event.target.value, 'text');
      message.innerHTML = '';
    }
  });

  async function handleFiles(files) {
    // chat.innerHTML = '';
    // console.log(files[0]);
    console.log('getting signedURL');

    const uuid = uuidv4();
    try {
      const { url } = await getURLForUpload(uuid);
      await uploadFile(url, files[0]);
      const downloadUrl = await getDownloadUrl(uuid);
      console.log(downloadUrl);
      console.log('is this a pdf ' + isPdfFile(files[0]));
      if (!isPdfFile(files[0])) {
        try {
          const image = await getImageThumbnail(files[0]);
          sendSignal({ image, downloadUrl }, 'image');
        } catch (e) {
          console.log(e);
        }
      } else {
        sendSignal({ downloadUrl }, 'file');
      }
    } catch (e) {
      console.log(e);
    }
  }

  const isPdfFile = file => {
    console.log(file);
    return file.name.endsWith('.pdf');
  };
});
