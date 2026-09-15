using NoteService.API.DTOs;
using NoteService.API.Models;
using NoteService.API.Repositories;

namespace NoteService.API.Services;

/// <summary>
/// Logique métier des notes. Fait le lien entre les DTOs (ce que voit l'API)
/// et le modèle Note (ce qui est stocké dans MongoDB). Pas d'AutoMapper ici :
/// les documents Mongo sont simples, un mapping manuel reste lisible.
/// </summary>
public class NoteService : INoteService
{
    private readonly INoteRepository _repository;

    public NoteService(INoteRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<NoteDto>> GetByPatientIdAsync(int patientId)
    {
        var notes = await _repository.GetByPatientIdAsync(patientId);
        return notes.Select(ToDto).ToList();
    }

    public async Task<NoteDto?> GetByIdAsync(string id)
    {
        var note = await _repository.GetByIdAsync(id);
        return note is null ? null : ToDto(note);
    }

    public async Task<NoteDto> CreateAsync(CreateNoteDto dto)
    {
        var note = new Note
        {
            PatientId = dto.PatientId,
            PatientName = dto.PatientName,
            NoteText = dto.NoteText
        };

        var created = await _repository.CreateAsync(note);
        return ToDto(created);
    }

    public async Task<bool> UpdateAsync(string id, UpdateNoteDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
        {
            return false;
        }

        existing.NoteText = dto.NoteText;
        return await _repository.UpdateAsync(id, existing);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static NoteDto ToDto(Note note) => new()
    {
        Id = note.Id ?? string.Empty,
        PatientId = note.PatientId,
        PatientName = note.PatientName,
        NoteText = note.NoteText
    };
}
