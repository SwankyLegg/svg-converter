import Checkbox from './Checkbox';

export default function FormatSelector({ selectedFormats, onFormatChange }) {
  const formats = ['png', 'jpg'];

  const handleFormatChange = (format) => {
    onFormatChange({
      ...selectedFormats,
      [format]: !selectedFormats[format]
    });
  };

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {formats.map(format => (
          <Checkbox
            key={format}
            label={
              <span style={{ fontWeight: 500 }}>{format.toUpperCase()}</span>
            }
            checked={selectedFormats[format]}
            onChange={() => handleFormatChange(format)}
          />
        ))}
      </div>
    </div>
  );
} 