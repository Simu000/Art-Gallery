
namespace aborginal_art_gallery.DTOs;

public class RegisterReponseDto
{
    public bool success { get; set; } = false;
    public string message { get; set; } = "";
    public string email { get; set; } = null!;
    public int UserId { get; set; }
}