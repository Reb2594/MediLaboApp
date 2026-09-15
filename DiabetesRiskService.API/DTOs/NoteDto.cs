namespace DiabetesRiskService.API.DTOs;

/// <summary>
/// Note reçue de NoteService.
/// </summary>
public class NoteDto
{
    public string? Id { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string NoteText { get; set; } = string.Empty;
}
