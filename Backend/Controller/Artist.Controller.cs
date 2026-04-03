using aborginal_art_gallery.Repositories;
using Microsoft.AspNetCore.Mvc;

using aborginal_art_gallery.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;


[ApiController]
[Route("api/artists")]

/// <summary>
/// Manages artist CRUD endpoints.
/// </summary>
public class ArtistController : ControllerBase
{
    private readonly IArtistRepository _repo;
    private readonly ICloudinaryService _cloudinary;

    public ArtistController(IArtistRepository repo, ICloudinaryService cloudinary)
    {
        _repo = repo;
        _cloudinary = cloudinary;
    }

    private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    /// <summary>
    /// Gets all artists.
    /// </summary>
    /// <returns>A list of artists.</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> getAll() => Ok(await _repo.getAllArtists());

    /// <summary>
    /// Gets one artist by identifier.
    /// </summary>
    /// <param name="id">The artist identifier.</param>
    /// <returns>The artist when found.</returns>
    [HttpGet("{id}")]
    [AllowAnonymous]

    public async Task<IActionResult> getById(int id)
    {
        var result = await _repo.getArtistById(id);
        if(result is null) return NotFound();
        return Ok(result);
    }

    /// <summary>
    /// Creates a new artist.
    /// </summary>
    /// <param name="dto">The artist payload.</param>
    /// <returns>The created artist.</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]

    public async Task<IActionResult> create([FromForm] CreateArtistDto dto)
    {
        string? photoUrl = null;

        if(dto.file != null)
        {
            photoUrl = await _cloudinary.UploadImageAsync(dto.file, CurrentUserId);
        }

        var artist = new Artist
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Country = dto.Country ?? "Australia",
            Bio = dto.Bio,
            BirthYear = dto.BirthYear,
            PhotoUrl = photoUrl,
            CreatedByUserId = CurrentUserId
        };

        var created = await _repo.createArtist(artist);

        return CreatedAtAction(nameof(getById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Updates an artist by identifier.
    /// </summary>
    /// <param name="id">The artist identifier.</param>
    /// <param name="dto">The artist payload.</param>
    /// <returns>The updated artist when successful.</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]

    public async Task<IActionResult> update(int id, [FromForm] CreateArtistDto dto)
    {
        var existing = await _repo.getArtistById(id);
        if(existing is null) return NotFound();

        string? photoUrl = existing.PhotoUrl;

        if(dto.file != null)
        {
            photoUrl = await _cloudinary.UploadImageAsync(dto.file, CurrentUserId);
        }

        existing.FirstName = dto.FirstName;
        existing.LastName = dto.LastName;
        existing.Country = dto.Country ?? existing.Country;
        existing.Bio = dto.Bio;
        existing.PhotoUrl = photoUrl;
        existing.BirthYear = dto.BirthYear;

        var success = await _repo.updateArtist(existing);

        return success ? Ok(existing) : BadRequest();
        
    }

    /// <summary>
    /// Deletes an artist by identifier.
    /// </summary>
    /// <param name="id">The artist identifier.</param>
    /// <returns>No content when deleted.</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]

    public async Task<IActionResult> delete(int id)
    {
        var success = await _repo.deleteArtist(id);
        return success ? NoContent() : NotFound();
    }
}