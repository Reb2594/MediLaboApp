namespace DiabetesRiskService.API.DTOs;

/// <summary>
/// Résultat renvoyé au Frontend.
/// </summary>
public class DiabetesAssessmentDto
{
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string Risk { get; set; } = string.Empty; // "None", "Borderline", "InDanger", "EarlyOnset"
}
