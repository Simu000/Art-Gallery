
using System.ComponentModel.DataAnnotations;

namespace aborginal_art_gallery.DTOs;
public class VerifyOtpDto
{
    [Required]
    [EmailAddress]
    public string email { get; set; } = "";

    [Required]
    [MaxLength(6, ErrorMessage = "Otp Must be 6 digits")]
    [MinLength(6, ErrorMessage = "Otp Must be 6 digits")]
    public string otp { get; set; } = "";
}