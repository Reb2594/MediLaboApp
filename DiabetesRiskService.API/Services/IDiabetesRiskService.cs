using DiabetesRiskService.API.DTOs;

namespace DiabetesRiskService.API.Services;

/// <summary>
/// Calcule le niveau de risque de diabète d'un patient.
/// </summary>
public interface IDiabetesRiskService
{
    Task<DiabetesAssessmentDto?> AssessAsync(int patientId);
}
