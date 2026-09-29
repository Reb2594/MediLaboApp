import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function useApi(url) {
  const { token, logout } = useAuth() 
  const navigate = useNavigate()         

  const [data, setData]       = useState(null)   
  const [loading, setLoading] = useState(true)   
  const [error, setError]     = useState(null)  
  const [reloadIndex, setReloadIndex] = useState(0)

  useEffect(() => {
    if (!url) return 

    setLoading(true)
    setError(null)

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
            logout()
            navigate('/login')
            return
        }
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json()
      })
      .then(result => {
        if (result === undefined) return
        setData(result)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })

  }, [url, token, reloadIndex]) 

  // Permet de redéclencher manuellement l'appel (ex: après avoir ajouté une note,
  // pour rafraîchir le niveau de risque sans recharger toute la page).
  const refetch = useCallback(() => setReloadIndex(i => i + 1), [])

  return { data, loading, error, refetch }
}

export default useApi