import { useState } from 'react'
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

  const [addedNotes, setAddedNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [noteError, setNoteError] = useState(null)

  const notes = [...(fetchedNotes || []), ...addedNotes]

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
      setAddedNotes([...addedNotes, created])
      setNewNote('')
    } else {
      setNoteError("Erreur lors de l'ajout de la note.")
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

      <h2 style={{ marginTop: '2rem' }}>Notes médicales</h2>
      <Card>
        {notesLoading && <p>Chargement des notes...</p>}
        {!notesLoading && notes.length === 0 && <p>Aucune note pour ce patient.</p>}
        {notes.map(note => (
          <p key={note.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            {note.noteText}
          </p>
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