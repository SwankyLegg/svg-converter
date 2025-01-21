export default function BrandDownload({ brandName, brandFiles, isProcessing, onDownload, numberOfSelectedCheckboxes, numberOfFormats }) {
  const numberOfUploads = brandFiles.length;
  const totalAssets = numberOfSelectedCheckboxes * numberOfFormats * numberOfUploads;
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: 0 }}>
        {brandName} ({totalAssets} download{totalAssets > 1 ? 's' :
          ''} for {numberOfUploads} upload{numberOfUploads > 1 ? 's' :
            ''})
      </h2>
      <label style={{
        padding: '12px 16px',
        backgroundColor: isProcessing || brandFiles.some(f => f.isLoading) ? '#ccc' : '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isProcessing || brandFiles.some(f => f.isLoading) ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontSize: '16px',
        opacity: isProcessing || brandFiles.some(f => f.isLoading) ? 0.7 : 1
      }}>
        {brandFiles.some(f => f.isLoading) ? 'Processing...' : 'Download Package'}
        <button
          onClick={() => onDownload(brandName)}
          disabled={isProcessing || brandFiles.some(f => f.isLoading)}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
} 