using aborginal_art_gallery.Models;
namespace aborginal_art_gallery.Repositories;

public interface IExhibitionRepository
{
    Task<IEnumerable<Exhibition>> getAllExhibitions();
    Task<Exhibition?> getExhibitionById(int id);
    Task<List<int>> getArtifactIdsForExhibition(int exhibitionId);
    Task<Exhibition> createExhibition(Exhibition exhibition, List<int> artifactIds);
    Task<bool> updateExhibition(Exhibition exhibition, List<int> artifactIds);
    Task<bool> deleteExhibition(int id);
}