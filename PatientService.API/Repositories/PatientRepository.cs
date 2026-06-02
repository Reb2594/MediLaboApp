using Microsoft.EntityFrameworkCore;
using PatientService.API.Data;
using PatientService.API.Models;

namespace PatientService.API.Repositories
{
    public class PatientRepository : IPatientRepository
    {
        private readonly AppDbContext _context;

        public PatientRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllAsync()
        {
            return await _context.Patients.ToListAsync();
        }

        public async Task<Patient?> GetByIdAsync(int id)
        {
            return await _context.Patients.FindAsync(id);
        }

        public async Task<Patient> CreateAsync(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient?> UpdateAsync(int id, Patient patient)
        {
            var existing = await _context.Patients.FindAsync(id);
            if (existing is null)
            {
                return null;
            }

            existing.FirstName = patient.FirstName;
            existing.LastName = patient.LastName;
            existing.DateOfBirth = patient.DateOfBirth;
            existing.Gender = patient.Gender;
            existing.Address = patient.Address;
            existing.PhoneNumber = patient.PhoneNumber;

            await _context.SaveChangesAsync();
            return existing;
        }
    }
}
