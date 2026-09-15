namespace DiabetesRiskService.API.DTOs;

/// <summary>
/// Infos patient pour calcul du risque (âge + genre), reçues de PatientService.
/// </summary>
public class PatientInfoDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
}
