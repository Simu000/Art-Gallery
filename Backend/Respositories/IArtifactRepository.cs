using aborginal_art_gallery.Models;

public interface IArtifactRepository
{
    Task <IEnumerable<Artifact>> getAllAsync();
    Task<Artifact?> GetByIdAsync(int id);
    Task<IEnumerable<Artifact>> SearchAsync(string query);
    Task<Artifact> CreateAsync(Artifact artifact);
    Task<bool> UpdateAsync(Artifact artifact);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<string>> GetArtFactsAsync();
}