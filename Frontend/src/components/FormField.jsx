function FormField({ label, type = 'text', ...props }) {
    return (
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        <span style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
          {label}
        </span>
        <input
          type={type}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg)',
            color: 'var(--text-h)',
          }}
          {...props}
        />
      </label>
    )
  }
  
  export default FormField