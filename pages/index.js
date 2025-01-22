// pages/index.js
import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { analyzeSVG } from '../utils/svgAnalyzer';
import { convertToPNG, convertToJPG } from '../utils/svgConverter';
import { allSizes } from '../utils/sizes';
import SizeSelector from '../components/SizeSelector';
import FileUploader from '../components/FileUploader';
import BrandDownload from '../components/BrandDownload';
import FormatSelector from '../components/FormatSelector';
import Section from '../components/Section';
import { logEvent, EventTypes } from '../utils/logger';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState({
    png: true,
    jpg: true
  });
  const [selectedSizes, setSelectedSizes] = useState(
    Object.fromEntries(allSizes.map(size => [size.name, true]))
  );
  const [brandZips, setBrandZips] = useState({});
  const [processingCount, setProcessingCount] = useState(0);

  const isProcessing = processingCount > 0;

  useEffect(() => {
    // Log page visit
    logEvent(EventTypes.PAGE_VIEW);
  }, []);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).filter(file => file.type === 'image/svg+xml');

    // Group files by root name and variants
    const fileGroups = {};
    newFiles.forEach(file => {
      const nameParts = file.name.split('_');
      const brandName = nameParts[0];

      // Extract component type (logo, wordmark, etc.) and remove .svg extension
      let componentType = nameParts[1]?.replace('.svg', '');

      // Build variant path based on remaining parts
      const remainingParts = nameParts.slice(2);
      const variants = [];

      // Process variants (mono, inverse, etc.)
      remainingParts.forEach(part => {
        if (part !== '') {
          // Remove .svg extension for directory names
          variants.push(part.replace('.svg', ''));
        }
      });

      // Create nested path without .svg extension
      let currentPath = componentType;
      if (variants.length > 0) {
        currentPath = `${componentType}_${variants.join('_')}`;
      }

      if (!fileGroups[brandName]) {
        fileGroups[brandName] = {};
      }
      fileGroups[brandName][currentPath] = file;
    });

    // Process each brand group
    Object.entries(fileGroups).forEach(([brandName, variants]) => {
      // Initialize or get existing ZIP for this brand
      let brandZip = brandZips[brandName]?.zip || new JSZip();
      setProcessingCount(prev => prev + Object.keys(variants).length);

      Object.entries(variants).forEach(([variantPath, file]) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const { dimensions } = analyzeSVG(e.target.result);

          const newFile = {
            name: file.name,
            content: e.target.result,
            ...dimensions,
            isLoading: true,
            brandName,
            variantPath
          };

          setFiles(prev => [...prev, newFile]);

          try {
            // Split variant path into components
            const pathParts = variantPath.split('_');
            const baseComponent = pathParts[0]; // logo or wordmark

            // Create base component folder
            const componentFolder = baseComponent;

            // Create variant subfolder if it exists
            const variantFolder = pathParts.length > 1
              ? variantPath
              : componentFolder;

            // Store original SVG
            brandZip.file(`${variantFolder}/${file.name}`, e.target.result);

            // Get current selected sizes
            const selectedSizesList = allSizes.filter(size => selectedSizes[size.name] === true);
            const selectedFormatsList = Object.entries(selectedFormats)
              .filter(([_, isSelected]) => isSelected)
              .map(([format]) => format);

            if (selectedSizesList.length === 0) {
              throw new Error('Please select at least one size before uploading files.');
            }

            if (selectedFormatsList.length === 0) {
              throw new Error('Please select at least one output format before uploading files.');
            }

            const conversions = await Promise.all(
              selectedSizesList.flatMap(size =>
                selectedFormatsList.map(format =>
                  format === 'png'
                    ? convertToPNG(e.target.result, size, file.name)
                    : convertToJPG(e.target.result, size, file.name)
                )
              )
            );

            // Handle both single and multiple file responses
            conversions.forEach((conversion) => {
              // If conversion is an array (multiple files), handle each file
              const files = Array.isArray(conversion) ? conversion : [conversion];
              files.forEach(({ blob, fileName, format, isStandalone }) => {
                if (isStandalone) {
                  // Place favicon.ico next to the SVG
                  brandZip.file(`${variantFolder}/${fileName}`, blob);
                } else {
                  // Place other files in their format-specific folders
                  const formatPath = `${variantFolder}/${format}`;
                  brandZip.file(`${formatPath}/${fileName}`, blob);
                }
              });
            });

            // Generate ZIP blob and URL
            const zipBlob = await brandZip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(zipBlob);

            // Update brand zips
            setBrandZips(prev => ({
              ...prev,
              [brandName]: { zip: brandZip, blob: zipBlob, url: zipUrl }
            }));

            setFiles(prev => prev.map(f =>
              f.name === file.name
                ? { ...f, isLoading: false }
                : f
            ));

            setProcessingCount(prev => prev - 1);
          } catch (error) {
            console.error('Processing failed:', error);
            setFiles(prev => prev.map(f =>
              f.name === file.name
                ? { ...f, isLoading: false, error: error.message }
                : f
            ));
            setProcessingCount(prev => prev - 1);
          }
        };
        reader.readAsText(file);
      });
    });
  };

  const downloadBrandZip = async (brandName) => {
    // Log the download event with selected formats and sizes
    await logEvent('download', {
      formats: selectedFormats,
      sizes: selectedSizes
    });

    const brandZip = brandZips[brandName];
    if (!brandZip) return;

    const link = document.createElement('a');
    link.href = brandZip.url;
    link.download = `${brandName}-assets.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group files by brand for display
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.brandName]) {
      acc[file.brandName] = [];
    }
    acc[file.brandName].push(file);
    return acc;
  }, {});

  return (
    <>
      <style jsx global>{`
        html, body {
          cursor: ${isProcessing ? 'wait' : 'default'} !important;
        }
      `}</style>
      <div style={{
        pointerEvents: isProcessing ? 'none' : 'auto',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: '1fr',
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '24px',
          fontWeight: '500'
        }}>SVG to Raster Converter</h1>

        <p style={{
          margin: '0',
          fontSize: '16px',
          color: '#222',
          lineHeight: '1.5'
        }}>Convert your SVG brand assets into PNG and JPG formats at multiple sizes. If you choose a favicon, you'll get a <code>favicon.ico</code> file as well. All conversion is done on your computer, so your files are never sent to a server. You can view the code <a href="https://github.com/SwankyLegg/svg-converter">here</a>.
        </p>
        <ol style={{
          color: '#222',
          lineHeight: 2,
          fontSize: '16px'
        }}>
          <li>Choose your desired output sizes and formats</li>
          <li>Upload your SVG files</li>
          <li>Download organized ZIP files containing all your converted assets</li>
        </ol>

        <Section>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '500'
          }}>Sizes</h2>

          <SizeSelector
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            disabled={isProcessing}
          />
        </Section>

        <Section>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '500'
          }}>Formats</h2>

          <FormatSelector
            selectedFormats={selectedFormats}
            onFormatChange={setSelectedFormats}
          />
        </Section>

        <Section>
          <FileUploader
            selectedSizes={selectedSizes}
            onFileUpload={handleFileUpload}
            files={files}
            disabled={isProcessing}
          />

          {Object.entries(groupedFiles).map(([brandName, brandFiles]) => (
            <BrandDownload
              key={brandName}
              brandName={brandName}
              brandFiles={brandFiles}
              isProcessing={isProcessing}
              onDownload={downloadBrandZip}
              numberOfSelectedCheckboxes={Object.values(selectedSizes).filter(Boolean).length}
              numberOfFormats={Object.values(selectedFormats).filter(Boolean).length}
            />
          ))}
        </Section>
      </div>
    </>
  );
}