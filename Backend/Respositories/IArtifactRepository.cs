using aborginal_art_gallery.Models;

public interface IArtifactRepository
{
    /// <summary>
    /// Gets all artifacts.
    /// </summary>
    /// <returns>A list of artifacts.</returns>
    Task <IEnumerable<Artifact>> getAllAsync();
    /// <summary>
    /// Gets artifact by identifier.
    /// </summary>
    /// <param name="id">Artifact identifier.</param>
    /// <returns>The artifact when found; otherwise null.</returns>
    Task<Artifact?> GetByIdAsync(int id);
    /// <summary>
    /// Searches artifacts using free text.
    /// </summary>
    /// <param name="query">Search text.</param>
    /// <returns>Matching artifacts.</returns>
    Task<IEnumerable<Artifact>> SearchAsync(string query);
    /// <summary>
    /// Creates an artifact.
    /// </summary>
    /// <param name="artifact">Artifact payload.</param>
    /// <returns>The created artifact.</returns>
    Task<Artifact> CreateAsync(Artifact artifact);
    /// <summary>
    /// Updates an artifact.
    /// </summary>
    /// <param name="artifact">Artifact payload.</param>
    /// <returns>True when updated; otherwise false.</returns>
    Task<bool> UpdateAsync(Artifact artifact);
    /// <summary>
    /// Deletes an artifact by identifier.
    /// </summary>
    /// <param name="id">Artifact identifier.</param>
    /// <returns>True when deleted; otherwise false.</returns>
    Task<bool> DeleteAsync(int id);
    /// <summary>
    /// Gets art facts.
    /// </summary>
    /// <returns>A list of fact strings.</returns>
    Task<IEnumerable<string>> GetArtFactsAsync();
}