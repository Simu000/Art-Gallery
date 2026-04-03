using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;
using aborginal_art_gallery.Services;

namespace aborginal_art_gallery.Controllers;

[ApiController]
[Route("api/exhibitions")]
public class ExhibitionsController : ControllerBase
{
    private readonly IExhibitionRepository _repo;
    private readonly ICloudinaryService _cloudinaryService;

    public ExhibitionsController(IExhibitionRepository repo, ICloudinaryService cloudinaryService)
    {
        _repo = repo;
        _cloudinaryService = cloudinaryService;
    }

    private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> getAll() => Ok(await _repo.getAllExhibitions());

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> getById(int id)
    {
        var ex = await _repo.getExhibitionById(id);
        if (ex == null) return NotFound();

        var artifactIds = await _repo.getArtifactIdsForExhibition(id);
        var dto = new ExhibitionDto
        {
            Id = ex.Id,
            Name = ex.Name,
            Description = ex.Description,
            StartDate = ex.StartDate,
            EndDate = ex.EndDate,
            Location = ex.Location,
            CoverImageUrl = ex.CoverImageUrl,
            ArtifactIds = artifactIds
        };

        return Ok(dto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> create([FromForm] CreateExhibitionDto dto)
    {
        string? coverUrl = null;

        if (dto.File != null)
        {
            coverUrl = await _cloudinaryService.UploadImageAsync(dto.File, CurrentUserId);
        }

        var exhibition = new Exhibition
        {
            Name = dto.Name,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Location = dto.Location,
            CoverImageUrl = coverUrl,
            CreatedByUserId = CurrentUserId
        };

        var created = await _repo.createExhibition(exhibition, dto.ArtifactIds);
        return CreatedAtAction(nameof(getById), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> update(int id, [FromForm] CreateExhibitionDto dto)
    {
        var existing = await _repo.getExhibitionById(id);
        if (existing == null) return NotFound();

        string? coverUrl = existing.CoverImageUrl;

        if (dto.File != null)
        {
            coverUrl = await _cloudinaryService.UploadImageAsync(dto.File, CurrentUserId);
        }

        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.StartDate = dto.StartDate;
        existing.EndDate = dto.EndDate;
        existing.Location = dto.Location;
        existing.CoverImageUrl = coverUrl;

        var success = await _repo.updateExhibition(existing, dto.ArtifactIds);
        return success ? Ok(existing) : BadRequest();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> delete(int id)
    {
        var success = await _repo.deleteExhibition(id);
        return success ? NoContent() : NotFound();
    }
}