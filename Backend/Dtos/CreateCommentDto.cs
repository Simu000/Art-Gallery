namespace aborginal_art_gallery.DTOs;

public class CreateCommentDto
{
    public int ArtifactId { get; set; }
    public string Text { get; set; } = string.Empty;
}