
using System.ComponentModel.DataAnnotations;

namespace aborginal_art_gallery.DTOs;

public class RegisterDto
{

    [Required(ErrorMessage = "First Name is Required")]
    [MaxLength(50, ErrorMessage = "First Name is too large")]
    public string FirstName { get; set; } = string.Empty;
    [MaxLength(50, ErrorMessage = "Last Name is too large")]
    public string? LastName { get; set; }
    [EmailAddress(ErrorMessage = "Email is not correct")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MinLength(8, ErrorMessage = "Password must be equal or greater than 8")]
    public string Password { get; set; } = string.Empty;

}