import { webSizes, socialPlatforms } from '../utils/sizes';
import Checkbox from './Checkbox';

export default function SizeSelector({ selectedSizes, setSelectedSizes, disabled }) {
  const getCurrentPreset = () => {
    const selectedCount = Object.values(selectedSizes).filter(Boolean).length;
    if (selectedCount === 0) return "";

    const allSizes = [...webSizes.sizes, ...Object.values(socialPlatforms).flatMap(platform => platform.sizes)];
    if (selectedCount === allSizes.length) return "all";

    // Check if all sizes of a specific platform are selected
    for (const [platform, data] of Object.entries(socialPlatforms)) {
      if (data.sizes.every(size => selectedSizes[size.name]) &&
        Object.values(socialPlatforms)
          .filter(p => p !== data)
          .flatMap(p => p.sizes)
          .every(size => !selectedSizes[size.name]) &&
        webSizes.sizes.every(size => !selectedSizes[size.name])) {
        return platform;
      }
    }

    // Check if all web sizes are selected
    if (webSizes.sizes.every(size => selectedSizes[size.name]) &&
      Object.values(socialPlatforms).flatMap(p => p.sizes).every(size => !selectedSizes[size.name])) {
      return "web";
    }

    return "custom";
  };

  const applyPreset = (presetName) => {
    setSelectedSizes(prev => {
      const newSizes = { ...prev };
      // First uncheck all
      Object.keys(newSizes).forEach(key => newSizes[key] = false);

      if (presetName === "web") {
        webSizes.sizes.forEach(size => {
          newSizes[size.name] = true;
        });
      } else if (socialPlatforms[presetName]) {
        socialPlatforms[presetName].sizes.forEach(size => {
          newSizes[size.name] = true;
        });
      }
      return newSizes;
    });
  };

  const renderSizeGroup = (title, sizes) => (
    <div key={title} style={{ marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '500',
        marginBottom: '16px',
        color: '#333'
      }}>{title}</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {sizes.map((size) => (
          <Checkbox
            key={size.name}
            label={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: 500 }}>{size.name}</span>
                <span style={{ fontSize: '14px', color: '#666' }}>{size.width}x{size.height}</span>
              </div>
            }
            checked={selectedSizes[size.name]}
            onChange={(e) => setSelectedSizes(prev => ({
              ...prev,
              [size.name]: e.target.checked
            }))}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <select
          value={getCurrentPreset()}
          onChange={(e) => {
            if (e.target.value === 'all') {
              setSelectedSizes(prev => {
                const newSizes = { ...prev };
                [...webSizes.sizes, ...Object.values(socialPlatforms).flatMap(p => p.sizes)]
                  .forEach(size => newSizes[size.name] = true);
                return newSizes;
              });
            } else if (e.target.value) {
              applyPreset(e.target.value);
            }
          }}
          disabled={disabled}
          style={{
            padding: '12px 16px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
            maxWidth: '300px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            backgroundColor: 'white',
            opacity: disabled ? 0.7 : 1
          }}
        >
          <option value="">Select preset...</option>
          <option value="all">All sizes</option>
          <option value="web">Web Assets</option>
          {Object.entries(socialPlatforms).map(([key, platform]) => (
            <option key={key} value={key}>{platform.name}</option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Web Sizes */}
      {renderSizeGroup(webSizes.name, webSizes.sizes)}

      {/* Social Platform Sizes */}
      {Object.values(socialPlatforms).map(platform =>
        renderSizeGroup(platform.name, platform.sizes)
      )}
    </div>
  );
} 