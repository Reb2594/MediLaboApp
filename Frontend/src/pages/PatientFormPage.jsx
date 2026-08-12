import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useApi from '../hooks/useApi'
import Button from '../components/Button'
import FormField from '../components/FormField'

function PatientFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {token} = useAuth()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phoneNumber: ''
  })

  const [errorMessage, setErrorMessage] = useState(null)

  const { data: existingPatient } = useApi(isEdit ? `/api/patients/${id}` : null)

  useEffect(() => {
    if (existingPatient) {
      setForm({
        firstName:   existingPatient.firstName,
        lastName:    existingPatient.lastName,
        dateOfBirth: existingPatient.dateOfBirth,
        gender:      existingPatient.gender,
        address:     existingPatient.address     || '',
        phoneNumber: existingPatient.phoneNumber || ''
      })
    }
  }, [existingPatient])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)

    const url = isEdit ? `/api/patients/${id}` : '/api/patients'
    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })

    if (response.ok) {
      navigate('/patients')
    } else {
      setErrorMessage('Erreur lors de la sauvegarde. Vérifiez les champs et réessayez.')
    }
  }

  const fieldStyle = { display: 'block', marginBottom: '1rem' }
  const inputStyle = { marginLeft: '0.5rem', padding: '4px' }

   return (
    <div style={{ padding: '2rem', maxWidth: '500px' }}>
      <h1>{isEdit ? 'Modifier le patient' : 'Ajouter un patient'}</h1>
      <form onSubmit={handleSubmit}>
        <FormField label="Prénom *"          name="firstName"   value={form.firstName}   onChange={handleChange} required />
        <FormField label="Nom *"             name="lastName"    value={form.lastName}    onChange={handleChange} required />
        <FormField label="Date de naissance *" type="date"      name="dateOfBirth"       value={form.dateOfBirth} onChange={handleChange} required />
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <span style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Genre *</span>
          <select
            name="gender" value={form.gender} onChange={handleChange} required
            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="">-- Choisir --</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </label>
        <FormField label="Adresse"   name="address"     value={form.address}     onChange={handleChange} />
        <FormField label="Téléphone" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        <div style={{ marginTop: '1.5rem' }}>
          <Button type="submit">{isEdit ? 'Enregistrer' : 'Ajouter'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/patients')}>Annuler</Button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  )
}

export default PatientFormPage
