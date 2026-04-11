namespace aborginal_art_gallery.DTOs;

public class LoginResponseDto
{
    public bool Requires2FA { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
}