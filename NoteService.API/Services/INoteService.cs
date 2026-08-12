using NoteService.API.DTOs;

namespace NoteService.API.Services;

public interface INoteService
{
    Task<List<NoteDto>> GetByPatientIdAsync(int patientId);
    Task<NoteDto?> GetByIdAsync(string id);
    Task<NoteDto> CreateAsync(CreateNoteDto dto);
    Task<bool> UpdateAsync(string id, UpdateNoteDto dto);
    Task<bool> DeleteAsync(string id);
}
