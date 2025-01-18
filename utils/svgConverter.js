import { analyzeSVGColors, parseSVG } from './svgAnalyzer';

const convertSVGToImage = (svgContent, size, fileName, format) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new canvas for this conversion
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Parse SVG and get dimensions
      const { dimensions: { width: naturalWidth, height: naturalHeight }, element: svgElement, doc } = parseSVG(svgContent);

      // Set canvas to exact target size from checkbox
      canvas.width = size.width;
      canvas.height = size.height;

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // For JPG, fill background based on SVG colors
        if (format === 'jpg') {
          const isLight = analyzeSVGColors(svgContent);
          ctx.fillStyle = isLight ? 'black' : 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Calculate scale to fit largest dimension while maintaining aspect ratio
        const scaleWidth = size.width / naturalWidth;
        const scaleHeight = size.height / naturalHeight;
        const scale = Math.min(scaleWidth, scaleHeight);

        // Calculate dimensions that maintain aspect ratio
        const scaledWidth = naturalWidth * scale;
        const scaledHeight = naturalHeight * scale;

        // Center the image
        const offsetX = (size.width - scaledWidth) / 2;
        const offsetY = (size.height - scaledHeight) / 2;

        // Enable crisp rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw scaled and centered image
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        // If this is a favicon size and we need to generate ICO
        if (size.generateIco && format === 'png') {
          // Create both PNG and ICO blobs
          Promise.all([
            new Promise(resolve => canvas.toBlob(resolve, 'image/png')),
            new Promise(resolve => {
              // For ICO, we'll convert the PNG data to ICO format
              canvas.toBlob(async (pngBlob) => {
                // Convert PNG blob to ICO format
                const icoBlob = await convertToIco(pngBlob);
                resolve(icoBlob);
              }, 'image/png');
            })
          ]).then(([pngBlob, icoBlob]) => {
            resolve([
              {
                blob: pngBlob,
                fileName: `${fileName.replace('.svg', '')}-${size.width}x${size.height}.png`,
                format: 'png'
              },
              {
                blob: icoBlob,
                fileName: 'favicon.ico',
                format: 'ico',
                isStandalone: true
              }
            ]);
          });
        } else {
          canvas.toBlob((blob) => {
            resolve({
              blob,
              fileName: `${fileName.replace('.svg', '')}-${size.width}x${size.height}.${format}`,
              format
            });
          }, format === 'jpg' ? 'image/jpeg' : 'image/png', format === 'jpg' ? 0.95 : undefined);
        }
      };

      img.onerror = (error) => {
        console.error('Image load error:', error);
        reject(error);
      };

      // Create blob URL from the SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(doc);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(svgBlob);
    } catch (error) {
      console.error('Conversion error:', error);
      reject(error);
    }
  });
};

// Function to convert PNG blob to ICO format
const convertToIco = async (pngBlob) => {
  // Create ICO header
  const header = new Uint8Array([
    0, 0,             // Reserved, must be 0
    1, 0,             // Image type (1 for ICO)
    1, 0,             // Number of images (1 image)
    16, 0,            // Width (16px)
    16, 0,            // Height (16px)
    0,                // Color palette size (0 for no palette)
    0,                // Reserved, must be 0
    1, 0,             // Color planes
    32, 0,            // Bits per pixel (32 for RGBA)
    pngBlob.size & 0xFF, (pngBlob.size >> 8) & 0xFF, (pngBlob.size >> 16) & 0xFF, (pngBlob.size >> 24) & 0xFF, // Image size in bytes
    22, 0, 0, 0       // Offset to image data (22 bytes for ICO header)
  ]);

  // Combine header with PNG data
  const pngData = await pngBlob.arrayBuffer();
  const icoData = new Uint8Array(header.length + pngData.byteLength);
  icoData.set(header);
  icoData.set(new Uint8Array(pngData), header.length);

  return new Blob([icoData], { type: 'image/x-icon' });
};

export const convertToPNG = (svgContent, size, fileName) => {
  return convertSVGToImage(svgContent, size, fileName, 'png');
};

export const convertToJPG = (svgContent, size, fileName) => {
  return convertSVGToImage(svgContent, size, fileName, 'jpg');
}; 