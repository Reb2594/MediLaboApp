using PatientService.API.DTOs;

namespace PatientService.API.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientDto>> GetAllAsync();
        Task<PatientDto?> GetByIdAsync(int id);
        Task<PatientDto> CreateAsync(CreatePatientDto dto);
        Task<PatientDto?> UpdateAsync(int id, UpdatePatientDto dto);
    }
}
