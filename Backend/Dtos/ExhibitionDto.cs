namespace aborginal_art_gallery.DTOs;

public class ExhibitionDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public string? CoverImageUrl { get; set; }
    public List<int> ArtifactIds { get; set; } = new();
}
