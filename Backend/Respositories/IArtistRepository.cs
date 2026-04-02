using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Repositories;

public interface IArtistRepository
{
    Task<IEnumerable<Artist>> getAllArtists();
    Task<Artist?> getArtistById(int id);
    Task<Artist> createArtist(Artist artist);
    Task<bool> updateArtist(Artist artist);
    Task<bool> deleteArtist(int id);
}