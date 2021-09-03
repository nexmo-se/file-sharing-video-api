import { getSignedUrl, getUrlForDownload } from './api';

export const getURLForUpload = async uuid => {
  try {
    const { data } = await getSignedUrl(uuid);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getDownloadUrl = async uuid => {
  try {
    const { data } = await getUrlForDownload(uuid);
    return data;
  } catch (e) {
    console.log(e);
  }
};

// export const uploadFile = async (url, fields, file) => {
//   console.log(file);
//   const data = {
//     bucket: fields.bucket,
//     ...fields,
//     'Content-Type': 'image/png',
//     file: file
//   };
//   const formData = new FormData();
//   for (const name in data) {
//     formData.append(name, data[name]);
//   }
//   const response = await fetch(url, {
//     method: 'POST',
//     body: formData
//   });
//   return response;
// };

export const uploadFile = async (url, file) => {
  console.log('posting to ' + url);
  await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: file
  });
};

export const toggleSidebar = () => {
  const sidebarElement = document.getElementById('sidebar');
  sidebarElement.hidden = !sidebarElement.hidden;
  const isHidden = sidebarElement.style.display === 'none';
  if (isHidden) {
    // Unhide
    sidebarElement.style.display = 'flex';
  } else {
    sidebarElement.style.display = 'none';
  }
};

export const addSenderBubble = sender => {
  const bubble = document.createElement('div');
  bubble.style.flexDirection = 'column';
  bubble.style.justifyContent = 'center';
  bubble.style.minWidth = '32px';
  bubble.style.maxWidth = '80%';
  bubble.style.paddingLeft = '8px';
  bubble.style.paddingRight = '8px';
  bubble.style.paddingTop = '4px';
  bubble.style.paddingBottom = '4px';
  bubble.style.marginBottom = '8px';
  bubble.style.marginTop = '8px';
  bubble.style.borderRadius = '16px';
  bubble.style.backgroundColor = '#871fff';
  bubble.innerHTML = sender;
  return bubble;
};

export function getFileIcon(file) {
  if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
    return 'Vlt-icon-file-doc';
  } else if (file.name.endsWith('.pdf')) {
    return 'Vlt-icon-file-pdf';
  }
}

export const generateDownloadButton = button => {
  const htmlString = `<div style="display: none; flex-direction: row; align-items:center; ">
  <button
    class="downloadButton, Vlt-btn,Vlt-btn--tertiary, Vlt-btn--icon">
    <svg>
      <use xlink:href="./src/volta-icons.svg#Vlt-icon-download-full" />
    </svg>
  </button>
</div>`;
  return htmlString;
};
