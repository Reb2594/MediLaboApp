function Card({ children }) {
    return (
      <div style={{
        backgroundColor: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        marginBottom: '1rem',
      }}>
        {children}
      </div>
    )
  }
  
  export default Card