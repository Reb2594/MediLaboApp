import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

// Le nom du claim "role" est long car .NET utilise l'URI standard des ClaimTypes
// plutôt qu'un simple mot "role" lors de la génération du JWT côté AuthService.
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

// Décode la partie payload d'un JWT (sans vérifier la signature : ça, c'est le rôle
// du serveur. Côté Frontend, on lit juste le rôle pour adapter l'affichage).
function decodeRole(jwt) {
  try {
    const payload = jwt.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(normalized)
    const claims = JSON.parse(json)
    return claims[ROLE_CLAIM] ?? null
  } catch {
    return null
  }
}

// Le Provider : enveloppe toute l'appli et partage token, role, login, logout
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(token ? decodeRole(token) : null)

  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setRole(decodeRole(newToken))
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setRole(null)
  }

  // Seuls Practitioner et Admin ont le droit d'écrire (créer/modifier/supprimer).
  const canWrite = role === 'Practitioner' || role === 'Admin'

  return (
    <AuthContext.Provider value={{ token, role, canWrite, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
