namespace aborginal_art_gallery.DTOs;

public class CommentDto
{
    public int Id { get; set; }
    public int ArtifactId { get; set; }
    public int UserId { get; set; }
    public string UserFirstName { get; set; } = string.Empty;
    public string UserLastName { get; set; } = string.Empty;
    public string? UserProfileImage { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}