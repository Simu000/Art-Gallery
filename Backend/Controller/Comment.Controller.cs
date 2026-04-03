using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Controllers;

[ApiController]
[Route("api/comments")]
/// <summary>
/// Handles artifact comments endpoints.
/// </summary>
public class CommentsController : ControllerBase
{
    private readonly ICommentRepository _repo;

    public CommentsController(ICommentRepository repo)
    {
        _repo = repo;
    }

    private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    /// <summary>
    /// Gets comments for one artifact.
    /// </summary>
    /// <param name="artifactId">The artifact identifier.</param>
    /// <returns>A list of comments for the artifact.</returns>
    [HttpGet("artifact/{artifactId}")]
    [AllowAnonymous]
    public async Task<IActionResult> getByArtifact(int artifactId)
    {
        var comments = await _repo.getCommentsByArtifact(artifactId);
        return Ok(comments);
    }

    
    /// <summary>
    /// Creates a comment for an artifact.
    /// </summary>
    /// <param name="dto">The comment payload.</param>
    /// <returns>The created comment.</returns>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> create([FromBody] CreateCommentDto dto)
    {
        var comment = new Comment
        {
            ArtifactId = dto.ArtifactId,
            UserId = CurrentUserId,
            Text = dto.Text
        };

        var created = await _repo.createComment(comment);
        return CreatedAtAction(nameof(getByArtifact), new { artifactId = dto.ArtifactId }, created);
    }

    
    /// <summary>
    /// Deletes a comment owned by current user.
    /// </summary>
    /// <param name="id">The comment identifier.</param>
    /// <returns>No content when deleted; otherwise forbidden.</returns>
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> delete(int id)
    {
        var success = await _repo.deleteComment(id, CurrentUserId);
        return success ? NoContent() : Forbid();
    }
}