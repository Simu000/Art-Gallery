using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentsController : ControllerBase
{
    private readonly ICommentRepository _repo;

    public CommentsController(ICommentRepository repo)
    {
        _repo = repo;
    }

    private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("artifact/{artifactId}")]
    [AllowAnonymous]
    public async Task<IActionResult> getByArtifact(int artifactId)
    {
        var comments = await _repo.getCommentsByArtifact(artifactId);
        return Ok(comments);
    }

    
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

    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> delete(int id)
    {
        var success = await _repo.deleteComment(id, CurrentUserId);
        return success ? NoContent() : Forbid();
    }
}