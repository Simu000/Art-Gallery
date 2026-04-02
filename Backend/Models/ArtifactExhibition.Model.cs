namespace aborginal_art_gallery.Models;

public class ArtifactExhibition
{
    public int ArtifactId { get; set; }
    public int ExhibitionId { get; set; }

    // Navigation
    // public Artifact Artifact { get; set; }
    // public Exhibition Exhibition { get; set; }
}