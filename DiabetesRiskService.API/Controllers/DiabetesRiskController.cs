using DiabetesRiskService.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiabetesRiskService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DiabetesRiskController : ControllerBase
{
    private readonly IDiabetesRiskService _diabetesRiskService;

    public DiabetesRiskController(IDiabetesRiskService diabetesRiskService)
    {
        _diabetesRiskService = diabetesRiskService;
    }

    // GET /api/diabetesrisk/{patientId}
    [HttpGet("{patientId}")]
    public async Task<IActionResult> GetAssessment(int patientId)
    {
        var assessment = await _diabetesRiskService.AssessAsync(patientId);
        if (assessment is null)
        {
            return NotFound();
        }

        return Ok(assessment);
    }
}
