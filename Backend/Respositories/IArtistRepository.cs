using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Repositories;

public interface IArtistRepository
{
    /// <summary>
    /// Gets all artists.
    /// </summary>
    /// <returns>A list of artists.</returns>
    Task<IEnumerable<Artist>> getAllArtists();
    /// <summary>
    /// Gets one artist by identifier.
    /// </summary>
    /// <param name="id">Artist identifier.</param>
    /// <returns>The artist when found; otherwise null.</returns>
    Task<Artist?> getArtistById(int id);
    /// <summary>
    /// Creates an artist.
    /// </summary>
    /// <param name="artist">Artist payload.</param>
    /// <returns>The created artist.</returns>
    Task<Artist> createArtist(Artist artist);
    /// <summary>
    /// Updates an artist.
    /// </summary>
    /// <param name="artist">Artist payload.</param>
    /// <returns>True when updated; otherwise false.</returns>
    Task<bool> updateArtist(Artist artist);
    /// <summary>
    /// Deletes an artist by identifier.
    /// </summary>
    /// <param name="id">Artist identifier.</param>
    /// <returns>True when deleted; otherwise false.</returns>
    Task<bool> deleteArtist(int id);
}