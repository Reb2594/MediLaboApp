import { useNavigate } from 'react-router-dom'
import useApi from '../hooks/useApi'
import Button from '../components/Button'

function PatientListPage() {
 const navigate = useNavigate()
 const { data: patients, loading, error } = useApi('/api/patients')
 
 if (loading) return <p style={{ padding: '2rem' }}>Chargement des patients...</p>
 if (error)   return <p style={{ padding: '2rem', color: 'red' }}>Erreur : {error}</p>

 return (
  <div style={{ padding: '2rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h1 style={{ margin: 0 }}>Liste des patients</h1>
    </div>
    <div style={{ marginBottom: '1rem' }}>
      <Button variant ="primary" onClick={() => navigate('/patients/new')}>
        + Ajouter un patient
      </Button>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Prénom</th>
          <th>Nom</th>
          <th>Date de naissance</th>
          <th>Genre</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(patient => (
          <tr key={patient.id}>
            <td>{patient.firstName}</td>
            <td>{patient.lastName}</td>
            <td>{patient.dateOfBirth}</td>
            <td>{patient.gender}</td>
            <td>
              <Button variant="secondary" onClick={() => navigate(`/patients/${patient.id}`)}>Voir</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
}

export default PatientListPage