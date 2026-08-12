namespace NoteService.API.DTOs;

/// <summary>
/// Ce que le frontend envoie pour créer une nouvelle note.
/// </summary>
public class CreateNoteDto
{
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string NoteText { get; set; } = string.Empty;
}
