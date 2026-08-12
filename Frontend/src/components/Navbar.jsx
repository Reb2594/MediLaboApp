import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './Button'
import logo from '../assets/logo-medilabo.png'

function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      height: '64px',
      backgroundColor: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>      
       <img
        src={logo}
        alt="MédiLabo Solutions"
        onClick={() => navigate('/patients')}
        style={{ height: '52px', cursor: 'pointer' }}
      />
      <Button variant="danger" onClick={handleLogout}>
        Déconnexion
      </Button>
    </nav>
  )
}

export default Navbar