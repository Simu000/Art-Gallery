
using System.ComponentModel.DataAnnotations;

namespace aborginal_art_gallery.DTOs;

public class CreateArtistDto
{
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(50, ErrorMessage = "First Name is too large")]
    public string FirstName { get; set; } = null!;
    [MaxLength(50, ErrorMessage = "Last Name is too large")]
    public string? LastName { get; set; }
    [Required(ErrorMessage = "Country is Required")]
    [MaxLength(100, ErrorMessage = "Country should be smaller than 100 characters")]
    public string? Country { get; set; }
    public IFormFile? file { get; set; }

    [Range(1000, 9999, ErrorMessage = "Birth Year must be a 4 digit year")]
    public int? BirthYear { get; set; }

    [MaxLength(2000, ErrorMessage = "Bio can't exeed 2000 characters")]
    public string? Bio { get; set; }

}