using aborginal_art_gallery.Data;
using aborginal_art_gallery.Models;
using Dapper;

namespace aborginal_art_gallery.Repositories;
public class ArtistRepository : IArtistRepository
{
    private readonly DapperContext _context;

    public ArtistRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task <IEnumerable<Artist>> getAllArtists()
    {
        var query = "SELECT * FROM artists ORDER BY firstname";
        using var conn = _context.CreateConnection();
        return await conn.QueryAsync<Artist>(query);
    }

    public async Task<Artist?> getArtistById(int id)
    {
        var query = "SELECT * FROM artists WHERE id = @Id";
        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<Artist>(query, new { Id = id });
    }

    public async Task<Artist> createArtist(Artist artist)
    {
        var query = "INSERT INTO artists (firstname, lastname, country, bio, birthyear, photourl, createdbyuserid) VALUES (@FirstName, @LastName, @Country, @Bio, @BirthYear, @PhotoUrl, @CreatedByUserId) RETURNING *";

        using var conn = _context.CreateConnection();

        return await conn.QuerySingleAsync<Artist>(query, artist);
    }

    public async Task<bool> updateArtist(Artist artist)
    {
        var query = "UPDATE artists SET firstname = @FirstName, lastname = LastName, country = @Country, birthyear = @BirthYear, photourl = @PhotoUrl WHERE id = @Id";
        using var conn = _context.CreateConnection();

        var result = await conn.ExecuteAsync(query, artist);
        return result > 0;
    }
    public async Task<bool> deleteArtist(int id)
    {
        var query = "DELETE FROM artists WHERE id = @Id";
        using var conn = _context.CreateConnection();
        var result = await conn.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }
}