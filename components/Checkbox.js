export default function Checkbox({ label, checked, onChange, disabled = false }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '18px',
          height: '18px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          marginTop: '2px'
        }}
      />
      <div style={{
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        marginTop: '2px'
      }}>
        {label}
      </div>
    </label>
  );
} 