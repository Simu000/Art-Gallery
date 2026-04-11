public class ArtifactDto
{
    public int Id;
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Medium { get; set; }
    public int? YearCreated { get; set; }
    public string? ImageUrl { get; set; }
}