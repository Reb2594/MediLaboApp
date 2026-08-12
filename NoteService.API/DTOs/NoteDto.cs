namespace NoteService.API.DTOs;

/// <summary>
/// Ce que l'API renvoie au frontend pour une note existante.
/// </summary>
public class NoteDto
{
    public string Id { get; set; } = string.Empty;
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string NoteText { get; set; } = string.Empty;
}
