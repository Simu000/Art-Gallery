using System.Security.Claims;
using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Services;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;

using aborginal_art_gallery.Models;



namespace aborginal_art_gallery.Controllers;

[ApiController]
[Route("api/artifacts")]

public class ArtifactController : ControllerBase
{
    private readonly IArtifactRepository _repo;
    private readonly ICloudinaryService _cloudinaryService;

    private int currentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    public ArtifactController(IArtifactRepository repo, ICloudinaryService cloudinaryService)
    {
        _repo = repo;
        _cloudinaryService = cloudinaryService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> getAll()
    {
        var result = await _repo.getAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> getById(int id)
    {
        var artifact = await _repo.GetByIdAsync(id);
        return artifact != null ? Ok(artifact) : NotFound();
    }

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if(string.IsNullOrEmpty(q)) return Ok(await _repo.getAllAsync());
        return Ok(await _repo.SearchAsync(q));
    }

    [HttpGet("facts")]
    [AllowAnonymous]
    public async Task<IActionResult> getArtFacts() => Ok(await _repo.GetArtFactsAsync());

    [Authorize(Roles = "Admin")]
    [HttpPost]

    public async Task<IActionResult> Create([FromForm] CreateArtifactDto dto)
    {
        string? imageUrl = null;
        
        if(dto.File != null)
        {
            imageUrl = await _cloudinaryService.UploadImageAsync(dto.File, currentUserId);
        }

        var artifact = new Artifact
        {
            Title = dto.Title,
            Description = dto.Description,
            Medium = dto.Medium,
            YearCreated = dto.YearCreated,
            ImageUrl = imageUrl,
            CreatedByUserId = currentUserId,
            ArtistId = dto.ArtistId,
        };

        var created = await _repo.CreateAsync(artifact);
        return CreatedAtAction(nameof(getById), new { id = created.Id}, created);

    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm]CreateArtifactDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if(existing is null) return NotFound();
        string? imageUrl = existing.ImageUrl;
        
        if(dto.File != null)
        {
            imageUrl = await _cloudinaryService.UploadImageAsync(dto.File, currentUserId);
        }

        existing.Title = dto.Title;
        existing.Description = dto.Description;
        existing.Medium = dto.Medium;
        existing.YearCreated = dto.YearCreated;
        existing.ImageUrl = imageUrl;
        existing.ArtistId = dto.ArtistId;


        var success = await _repo.UpdateAsync(existing);
        return success ? Ok(existing) : BadRequest();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]

    public async Task<IActionResult> delete(int id)
    {
        bool success = await _repo.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }

}