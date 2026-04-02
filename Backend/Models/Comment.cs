namespace aborginal_art_gallery.Models;

public class Comment
{
    public int Id { get; set; }
    public int ArtifactId { get; set; }
    public int UserId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}