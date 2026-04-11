
using System.ComponentModel.DataAnnotations;

namespace aborginal_art_gallery.DTOs;
public class CreateArtifactDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Medium { get; set; }
    public int? YearCreated { get; set; }
    public IFormFile? File { get; set; }
    public int? ArtistId { get; set; }
}