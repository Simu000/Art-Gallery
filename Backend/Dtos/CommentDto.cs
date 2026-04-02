namespace aborginal_art_gallery.DTOs;

public class CommentDto
{
    public int Id { get; set; }
    public int ArtifactId { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;   // joined from users table
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}