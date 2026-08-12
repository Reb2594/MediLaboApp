using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NoteService.API.Models;

/// <summary>
/// Représente un document "note" stocké dans la collection MongoDB "Notes".
/// Contrairement à SQL Server, il n'y a pas de table ni de colonnes fixes :
/// chaque note est un document JSON indépendant.
/// </summary>
public class Note
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("patientId")]
    public int PatientId { get; set; }

    [BsonElement("patientName")]
    public string PatientName { get; set; } = string.Empty;

    [BsonElement("note")]
    public string NoteText { get; set; } = string.Empty;
}
