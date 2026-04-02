
using System.ComponentModel.DataAnnotations;

namespace aborginal_art_gallery.Models;

public class Artifact
{
    public int Id { get; set; }
    [Required]
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Medium { get; set; }
    public int? YearCreated { get; set; }
    public string? ImageUrl { get; set; }
    public int? ArtistId { get; set; }               // Foreign Key
    public int CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}