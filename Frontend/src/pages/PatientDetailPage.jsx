import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useApi from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Card from '../components/Card'

function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const {data: patient, loading, error } = useApi(`/api/patients/${id}`)
  const { data: fetchedNotes, loading: notesLoading } = useApi(`/api/notes?patientId=${id}`)
  const { data: risk, loading: riskLoading } = useApi(`/api/diabetesrisk/${id}`)

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [noteError, setNoteError] = useState(null)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingText, setEditingText] = useState('')

  useEffect(() => {
    if (fetchedNotes) setNotes(fetchedNotes)
  }, [fetchedNotes])

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setNoteError(null)

    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        patientId: Number(id),
        patientName: `${patient.firstName} ${patient.lastName}`,
        noteText: newNote
      })
    })

    if (response.ok) {
      const created = await response.json()
      setNotes([...notes, created])
      setNewNote('')
    } else {
      setNoteError("Erreur lors de l'ajout de la note.")
    }
  }

  const handleStartEdit = (note) => {
    setEditingNoteId(note.id)
    setEditingText(note.noteText)
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditingText('')
  }

  const handleSaveEdit = async (noteId) => {
    if (!editingText.trim()) return
    setNoteError(null)

    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ noteText: editingText })
    })

    if (response.ok) {
      setNotes(notes.map(n => n.id === noteId ? { ...n, noteText: editingText } : n))
      setEditingNoteId(null)
    } else {
      setNoteError('Erreur lors de la modification de la note.')
    }
  }

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm('Supprimer cette note ?')
    if (!confirmed) return
    setNoteError(null)

    const response = await fetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.ok) {
      setNotes(notes.filter(n => n.id !== noteId))
    } else {
      setNoteError('Erreur lors de la suppression de la note.')
    }
  }


  if (loading) return <p style={{ padding: '2rem' }}>Chargement du dossier...</p>
  if (error)   return <p style={{ padding: '2rem', color: 'red' }}>Erreur : {error}</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h1>Dossier patient</h1>
      <Card>
        <p><strong>Nom :</strong> {patient.lastName}</p>
        <p><strong>Prénom :</strong> {patient.firstName}</p>
        <p><strong>Date de naissance :</strong> {patient.dateOfBirth}</p>
        <p><strong>Genre :</strong> {patient.gender}</p>
        <p><strong>Adresse :</strong> {patient.address || '—'}</p>
        <p><strong>Téléphone :</strong> {patient.phoneNumber || '—'}</p>
      </Card>

      <h2 style={{ marginTop: '2rem' }}>Risque de diabète</h2>
      <Card>
        {riskLoading && <p>Calcul du risque en cours...</p>}
        {!riskLoading && risk && (
          <p><strong>Niveau de risque :</strong> {risk.risk}</p>
        )}
        {!riskLoading && !risk && <p>Impossible de calculer le risque.</p>}
      </Card>

      <h2 style={{ marginTop: '2rem' }}>Notes médicales</h2>
      <Card>
        {notesLoading && <p>Chargement des notes...</p>}
        {!notesLoading && notes.length === 0 && <p>Aucune note pour ce patient.</p>}
        {notes.map(note => (
          <div key={note.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            {editingNoteId === note.id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px' }}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <Button onClick={() => handleSaveEdit(note.id)}>💾 Enregistrer</Button>
                  <Button variant="secondary" onClick={handleCancelEdit}>Annuler</Button>
                </div>
              </>
            ) : (
              <>
                <p>{note.noteText}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="secondary" onClick={() => handleStartEdit(note)}>✏️ Modifier</Button>
                  <Button variant="danger" onClick={() => handleDeleteNote(note.id)}>🗑️ Supprimer</Button>
                </div>
              </>
            )}
          </div>
        ))}
      </Card>

      <form onSubmit={handleAddNote} style={{ marginTop: '1rem' }}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Ajouter une note médicale..."
          rows={3}
          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px' }}
        />
        <div style={{ marginTop: '0.5rem' }}>
          <Button type="submit">Ajouter la note</Button>
        </div>
        {noteError && <p className="error-message">{noteError}</p>}
      </form>

      <Button onClick={() => navigate(`/patients/${id}/edit`)}>✏️ Modifier</Button>
      <Button variant="secondary" onClick={() => navigate('/patients')}>← Retour</Button>
    </div>
  )
}

export default PatientDetailPage