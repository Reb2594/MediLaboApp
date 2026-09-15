using System.Globalization;
using DiabetesRiskService.API.DTOs;

namespace DiabetesRiskService.API.Services;

public class DiabetesRiskService : IDiabetesRiskService
{
    private readonly IHttpClientFactory _httpClientFactory;

    // Termes déclencheurs
    private static readonly string[] TriggerTerms =
    [
        "hémoglobine a1c",
        "microalbumine",
        "taille",
        "poids",
        "fume",        
        "anorma",  
        "cholestérol",
        "vertige",
        "rechute",
        "réaction",
        "anticorps"
    ];

    public DiabetesRiskService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<DiabetesAssessmentDto?> AssessAsync(int patientId)
    {
        var patientClient = _httpClientFactory.CreateClient("PatientService");
        var noteClient = _httpClientFactory.CreateClient("NoteService");

        var patient = await patientClient.GetFromJsonAsync<PatientInfoDto>($"api/patients/{patientId}");
        if (patient is null)
        {
            return null;
        }

        var notes = await noteClient.GetFromJsonAsync<List<NoteDto>>($"api/notes?patientId={patientId}")
                    ?? [];

        var triggerCount = CountDistinctTriggers(notes);
        var age = CalculateAge(patient.DateOfBirth);
        var isMale = patient.Gender.Equals("M", StringComparison.OrdinalIgnoreCase)
                     || patient.Gender.Equals("Male", StringComparison.OrdinalIgnoreCase);

        var risk = DetermineRisk(triggerCount, age, isMale);

        return new DiabetesAssessmentDto
        {
            PatientId = patient.Id,
            PatientName = $"{patient.FirstName} {patient.LastName}",
            Risk = risk
        };
    }

    private static int CountDistinctTriggers(List<NoteDto> notes)
    {
        // Concaténation du texte des notes, en minuscule, pour recherche insensible à la casse.
        var fullText = string.Join(" ", notes.Select(n => n.NoteText)).ToLowerInvariant();

        return TriggerTerms.Count(term => fullText.Contains(term));
    }

    private static int CalculateAge(DateOnly dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var age = today.Year - dateOfBirth.Year;
        if (dateOfBirth > today.AddYears(-age))
        {
            age--;
        }
        return age;
    }

    private static string DetermineRisk(int triggerCount, int age, bool isMale)
    {
        // Si le patient a plus de 30 ans
        if (age > 30)
        {
            if (triggerCount >= 8) return "EarlyOnset";
            if (triggerCount is >= 6 and <= 7) return "InDanger";
            if (triggerCount is >= 2 and <= 5) return "Borderline";
            return "None";
        }

        // Patient de 30 ans ou moins : dépend du genre
        if (isMale)
        {
            if (triggerCount >= 5) return "EarlyOnset";
            if (triggerCount >= 3) return "InDanger";
            return "None";
        }
        else
        {
            if (triggerCount >= 7) return "EarlyOnset";
            if (triggerCount >= 4) return "InDanger";
            return "None";
        }
    }
}
