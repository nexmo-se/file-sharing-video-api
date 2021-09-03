export const getResizedCanvasFromImage = (
  attachment,
  maxSize,
  minHeight,
  minWidth
) => {
  const canvas = document.createElement('canvas');
  const img = new Image();
  img.src = URL.createObjectURL(attachment);
  return new Promise(resolve => {
    img.onload = () => {
      let scale = 1;
      if (img.width > maxSize || img.height > maxSize) {
        scale = maxSize / Math.max(img.height, img.width);
      }
      let width = img.width * scale;
      let height = img.height * scale;

      // We need a minimum height and width for displaying the thumbnail correctly
      // in the chats.
      if ((minHeight && minHeight > height) || (minWidth && minWidth > width)) {
        const widthScale = minWidth / width;
        const heightScale = minHeight / height;
        height = Math.min(height * Math.max(heightScale, widthScale), maxSize);
        width = Math.min(width * Math.max(heightScale, widthScale), maxSize);
      }
      canvas.height = height;
      canvas.width = width;
      const ctx = canvas.getContext('2d');

      // Needed for png and maybe other image types
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(img.src);
      resolve(canvas);
    };
  });
};
