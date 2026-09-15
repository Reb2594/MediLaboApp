using Microsoft.Extensions.Options;
using MongoDB.Driver;
using NoteService.API.Models;

namespace NoteService.API.Repositories;

/// <summary>
/// Implémentation MongoDB du repository de notes.
/// Pas de DbContext ici : IMongoCollection<Note>; joue un rôle équivalent à un DbSet<T>;
/// </summary>
public class NoteRepository : INoteRepository
{
    private readonly IMongoCollection<Note> _notesCollection;

    public NoteRepository(IOptions<MongoDbSettings> mongoDbSettings)
    {
        var settings = mongoDbSettings.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _notesCollection = database.GetCollection<Note>(settings.NotesCollectionName);
    }

    public async Task<List<Note>> GetByPatientIdAsync(int patientId)
    {
        return await _notesCollection
            .Find(note => note.PatientId == patientId)
            .ToListAsync();
    }

    public async Task<Note?> GetByIdAsync(string id)
    {
        return await _notesCollection
            .Find(note => note.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Note> CreateAsync(Note note)
    {
        await _notesCollection.InsertOneAsync(note);
        return note;
    }

    public async Task<bool> UpdateAsync(string id, Note note)
    {
        var result = await _notesCollection.ReplaceOneAsync(n => n.Id == id, note);
        return result.MatchedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _notesCollection.DeleteOneAsync(n => n.Id == id);
        return result.DeletedCount > 0;
    }
}
