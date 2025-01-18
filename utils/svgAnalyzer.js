// Helper to convert hex to RGB
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Helper to get brightness from RGB
const getBrightness = (r, g, b) => (r * 299 + g * 587 + b * 114) / 1000;

// Process individual color
const processColor = (color, totalBrightness, colorCount) => {
  if (!color || color === 'none') return { totalBrightness, colorCount };

  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (rgb) {
      return {
        totalBrightness: totalBrightness + getBrightness(rgb.r, rgb.g, rgb.b),
        colorCount: colorCount + 1
      };
    }
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      return {
        totalBrightness: totalBrightness + getBrightness(Number(match[0]), Number(match[1]), Number(match[2])),
        colorCount: colorCount + 1
      };
    }
  }

  return { totalBrightness, colorCount };
};

export const parseSVG = (svgContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.documentElement;

  // Get dimensions
  const viewBox = svgElement.getAttribute('viewBox')?.split(' ').map(Number);
  const width = viewBox ? viewBox[2] : parseInt(svgElement.getAttribute('width'));
  const height = viewBox ? viewBox[3] : parseInt(svgElement.getAttribute('height'));

  // Set explicit dimensions
  svgElement.setAttribute('width', width || 100);
  svgElement.setAttribute('height', height || 100);

  // Analyze colors
  let totalBrightness = 0;
  let colorCount = 0;

  const elements = doc.querySelectorAll('*');
  elements.forEach(el => {
    const fillResult = processColor(el.getAttribute('fill'), totalBrightness, colorCount);
    const strokeResult = processColor(el.getAttribute('stroke'), fillResult.totalBrightness, fillResult.colorCount);
    totalBrightness = strokeResult.totalBrightness;
    colorCount = strokeResult.colorCount;
  });

  return {
    element: svgElement,
    doc,
    dimensions: {
      width: width || 100,
      height: height || 100,
      aspectRatio: (width || 100) / (height || 100)
    },
    isLight: colorCount > 0 ? (totalBrightness / colorCount) > 128 : true
  };
};

export const analyzeSVG = (svgContent) => {
  const { dimensions, isLight } = parseSVG(svgContent);
  return { dimensions, isLight };
};

// Kept for backward compatibility
export const analyzeSVGColors = (svgContent) => {
  const { isLight } = analyzeSVG(svgContent);
  return isLight;
}; 