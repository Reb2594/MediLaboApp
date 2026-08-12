function Button({ variant = 'primary', children, ...props }) {
    const base = {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      marginRight: '8px',
      transition: 'opacity 0.2s',
    }
  
    const variants = {
      primary:   { backgroundColor: '#C0392B', color: '#fff' },
      secondary: { backgroundColor: 'var(--code-bg)', color: 'var(--text-h)', border: '1px solid var(--border)' },
      danger:    { backgroundColor: '#7B241C', color: '#fff' },
    }
  
    return (
      <button
        style={{ ...base, ...variants[variant] }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        {...props}
      >
        {children}
      </button>
    )
  }
  
  export default Button