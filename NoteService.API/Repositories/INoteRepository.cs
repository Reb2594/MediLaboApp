using NoteService.API.Models;

namespace NoteService.API.Repositories;

public interface INoteRepository
{
    Task<List<Note>> GetByPatientIdAsync(int patientId);
    Task<Note?> GetByIdAsync(string id);
    Task<Note> CreateAsync(Note note);
    Task<bool> UpdateAsync(string id, Note note);
    Task<bool> DeleteAsync(string id);
}
