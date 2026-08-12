using Microsoft.AspNetCore.Mvc;
using NoteService.API.DTOs;
using NoteService.API.Services;

namespace NoteService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotesController : ControllerBase
{
    private readonly INoteService _noteService;

    public NotesController(INoteService noteService)
    {
        _noteService = noteService;
    }

    // GET /api/notes?patientId=1
    [HttpGet]
    public async Task<ActionResult<List<NoteDto>>> GetByPatientId([FromQuery] int patientId)
    {
        var notes = await _noteService.GetByPatientIdAsync(patientId);
        return Ok(notes);
    }

    // GET /api/notes/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<NoteDto>> GetById(string id)
    {
        var note = await _noteService.GetByIdAsync(id);
        if (note is null)
        {
            return NotFound();
        }

        return Ok(note);
    }

    // POST /api/notes
    [HttpPost]
    public async Task<ActionResult<NoteDto>> Create([FromBody] CreateNoteDto dto)
    {
        var created = await _noteService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/notes/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateNoteDto dto)
    {
        var updated = await _noteService.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE /api/notes/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _noteService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
