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

export const generateDownloadButton = downloadUrl => {
  console.log(downloadUrl);
  const htmlString = `
  <button
  onclick="(function(){
    const aElement = document.createElement('a');
         aElement.href = '${downloadUrl}';
        aElement.download = 'file';
         aElement.click();
  })()"
    class="downloadButton Vlt-icon Vlt-btn Vlt-btn--tertiary Vlt-btn--icon">
    <svg>
      <use xlink:href="./src/volta-icons.svg#Vlt-icon-download-full" />
    </svg>
  </button>
`;
  return htmlString;
};

export const getFileIconName = file => {
  if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
    return 'Vlt-icon-file-doc';
  } else if (file.name.endsWith('.pdf')) {
    return 'Vlt-icon-file-pdf';
  } else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) {
    return 'Vlt-icon-file-ppt';
  } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
    return 'Vlt-icon-file-xls';
  } else if (file.name.endsWith('.zip')) {
    return 'Vlt-icon-file-zip';
  } else if (
    file.type.toLowerCase().includes('video') ||
    file.name.endsWith('.mp4')
  ) {
    return 'Vlt-icon-file-video';
  } else if (file.type.toLowerCase().includes('image')) {
    return 'Vlt-icon-image';
  }
  return 'Vlt-icon-file';
};

export const generateIconButton = icon => {
  const htmlString = `
 
    <svg class="Vlt-icon">
      <use xlink:href="./src/volta-icons.svg#${icon}" />
    </svg>

  `;
  return htmlString;
};

export const generateDownloadDiv = () => {
  const htmlString = `<div style="display: none; flex-direction: row; align-items:center; ">
</div>`;
  return htmlString;
};
