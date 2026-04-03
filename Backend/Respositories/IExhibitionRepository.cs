using aborginal_art_gallery.Models;
namespace aborginal_art_gallery.Repositories;

public interface IExhibitionRepository
{
    /// <summary>
    /// Gets all exhibitions.
    /// </summary>
    /// <returns>A list of exhibitions.</returns>
    Task<IEnumerable<Exhibition>> getAllExhibitions();
    /// <summary>
    /// Gets one exhibition by identifier.
    /// </summary>
    /// <param name="id">Exhibition identifier.</param>
    /// <returns>The exhibition when found; otherwise null.</returns>
    Task<Exhibition?> getExhibitionById(int id);
    /// <summary>
    /// Gets artifact identifiers for an exhibition.
    /// </summary>
    /// <param name="exhibitionId">Exhibition identifier.</param>
    /// <returns>Artifact identifier list.</returns>
    Task<List<int>> getArtifactIdsForExhibition(int exhibitionId);
    /// <summary>
    /// Creates an exhibition with artifact links.
    /// </summary>
    /// <param name="exhibition">Exhibition payload.</param>
    /// <param name="artifactIds">Artifact identifiers.</param>
    /// <returns>The created exhibition.</returns>
    Task<Exhibition> createExhibition(Exhibition exhibition, List<int> artifactIds);
    /// <summary>
    /// Updates an exhibition and artifact links.
    /// </summary>
    /// <param name="exhibition">Exhibition payload.</param>
    /// <param name="artifactIds">Artifact identifiers.</param>
    /// <returns>True when updated; otherwise false.</returns>
    Task<bool> updateExhibition(Exhibition exhibition, List<int> artifactIds);
    /// <summary>
    /// Deletes an exhibition by identifier.
    /// </summary>
    /// <param name="id">Exhibition identifier.</param>
    /// <returns>True when deleted; otherwise false.</returns>
    Task<bool> deleteExhibition(int id);
}