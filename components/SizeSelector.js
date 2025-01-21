import { webSizes, socialPlatforms } from '../utils/sizes';
import Checkbox from './Checkbox';
import Accordion from './Accordion';

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

  const renderSizeGroup = (title, sizes) => {
    const allChecked = sizes.every(size => selectedSizes[size.name]);
    const someChecked = sizes.some(size => selectedSizes[size.name]);

    const handleGroupCheckbox = (checked) => {
      setSelectedSizes(prev => {
        const newSizes = { ...prev };
        sizes.forEach(size => {
          newSizes[size.name] = checked;
        });
        return newSizes;
      });
    };

    const titleContent = (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1
      }}>
        <div
          onClick={(e) => {
            // Prevent accordion toggle when clicking the checkbox area
            e.preventDefault();
            e.stopPropagation();
            handleGroupCheckbox(!allChecked);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && someChecked}
            onChange={(e) => {
              e.stopPropagation();
              handleGroupCheckbox(e.target.checked);
            }}
            disabled={disabled}
          />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#333',
            margin: 0,
            cursor: 'pointer'
          }}>{title}</h3>
        </div>
      </div>
    );

    return (
      <Accordion title={titleContent}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          paddingLeft: '32px'
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
      </Accordion>
    );
  };

  return (
    <div>
      <style global jsx>{`
        .chevron {
          transform: rotate(-90deg);
          transition: transform 0.3s ease;
        }
        details[open] .chevron {
          transform: rotate(0deg);
        }
      `}</style>
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