using AutoMapper;
using PatientService.API.DTOs;
using PatientService.API.Models;
using PatientService.API.Repositories;

namespace PatientService.API.Services
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _repository;
        private readonly IMapper _mapper;

        public PatientService(IPatientRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PatientDto>> GetAllAsync()
        {
            var patients = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<PatientDto>>(patients);
        }

        public async Task<PatientDto?> GetByIdAsync(int id)
        {
            var patient = await _repository.GetByIdAsync(id);
            if (patient is null)
            {
                return null;
            }

            return _mapper.Map<PatientDto>(patient);
        }

        public async Task<PatientDto> CreateAsync(CreatePatientDto dto)
        {
            var patient = _mapper.Map<Patient>(dto);
            var created = await _repository.CreateAsync(patient);
            return _mapper.Map<PatientDto>(created);
        }

        public async Task<PatientDto?> UpdateAsync(int id, UpdatePatientDto dto)
        {
            var patient = _mapper.Map<Patient>(dto);
            var updated = await _repository.UpdateAsync(id, patient);
            if (updated is null)
            {
                return null;
            }

            return _mapper.Map<PatientDto>(updated);
        }
    }
}
