using System.ComponentModel.DataAnnotations;

namespace aborginal_art_gallery.Models;

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string FirstName { get; set; } = null!;

    [MaxLength(50)]
    public string LastName { get; set; } = null!;

    [EmailAddress, Required, MaxLength(150)]
    public string Email { get; set; } = null!;
    [Required]
    public string PasswordHash { get; set; } = null!;
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = "User";
    public string Status { get; set; } = "Active";
    public string? ProfileImage { get; set; }
    public bool IsEmailVerified { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedAt { get; set; } = DateTime.UtcNow;
}