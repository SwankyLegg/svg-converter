export default function FileUploader({ selectedSizes, onFileUpload, files, disabled }) {
  const allSizesDisabled = Object.values(selectedSizes).every(v => !v);
  const isDisabled = disabled || allSizesDisabled;

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label style={{
          padding: '12px 16px',
          backgroundColor: isDisabled ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          fontSize: '16px',
          opacity: isDisabled ? 0.7 : 1
        }}>
          Choose Files
          <input
            type="file"
            accept=".svg"
            multiple
            onChange={onFileUpload}
            disabled={isDisabled}
            style={{
              display: 'none'
            }}
          />
        </label>
      </div>

      {files && files.length > 0 && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {files.map((file, index) => (
            <div key={index} style={{
              color: '#666',
              fontFamily: 'inherit',
              fontSize: '16px'
            }}>
              {file.name} ({file.width}x{file.height})
            </div>
          ))}
        </div>
      )}

      <div style={{
        color: '#666',
        marginTop: '8px',
        opacity: allSizesDisabled ? 1 : 0,
        transition: 'opacity 0.2s',
        fontFamily: 'inherit',
        fontSize: '16px'
      }}>
        Select at least 1 output size
      </div>
    </div>
  );
} 