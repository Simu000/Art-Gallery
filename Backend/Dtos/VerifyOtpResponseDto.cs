namespace aborginal_art_gallery.DTOs;

public class VerifyOtpResponseDto
{
    public bool success { get; set; }
     public string Message { get; set; } = "";
    public string? Token { get; set; } = null;
    public string? Email { get; set; } = null;
}