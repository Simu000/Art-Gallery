using System.ComponentModel.DataAnnotations;

namespace aborginal_art_gallery.Models;

public class Artist
{
    public int Id { get; set; }
    [Required, MaxLength(50)]
    
    public string FirstName { get; set; } = null!;

    [MaxLength(50)]
    public string? LastName { get; set; }
    [Required, MaxLength(100)]
    public string Country { get; set; } = "Australia";
    public string? Bio { get; set; }
    public int? BirthYear { get; set; }
    public string? PhotoUrl { get; set; }
    public int CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;


}   