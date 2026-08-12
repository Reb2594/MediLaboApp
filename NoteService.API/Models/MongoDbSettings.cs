namespace NoteService.API.Models;

/// <summary>
/// Contient les informations de connexion à MongoDB, lues depuis appsettings.json
/// (section "MongoDbSettings"). Injecté via IOptions&lt;MongoDbSettings&gt;.
/// </summary>
public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string NotesCollectionName { get; set; } = string.Empty;
}
