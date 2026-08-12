namespace NoteService.API.DTOs;

/// <summary>
/// Ce que le frontend envoie pour modifier le texte d'une note existante.
/// </summary>
public class UpdateNoteDto
{
    public string NoteText { get; set; } = string.Empty;
}
