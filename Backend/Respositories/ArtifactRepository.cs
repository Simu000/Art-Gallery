using aborginal_art_gallery.Data;
using aborginal_art_gallery.Models;
using Dapper;

namespace aborginal_art_gallery.Repositories;

public class ArtifactRepository : IArtifactRepository
{
    private readonly DapperContext _context;

    public ArtifactRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Artifact>> getAllAsync()
    {
        var query = "SELECT * FROM artifacts ORDER BY createdat";

        using var conn = _context.CreateConnection();

        return await conn.QueryAsync<Artifact>(query);
    }

    public async Task<Artifact?> GetByIdAsync(int id)
    {
        var query = "SELECT * FROM artifacts WHERE id = @Id";

        using var conn = _context.CreateConnection();

        return await conn.QueryFirstOrDefaultAsync<Artifact>(query, new { Id = id });
    }

    public async Task<IEnumerable<Artifact>> SearchAsync(string queryText)
    {
        var sql = @"
        SELECT * FROM artifacts
        WHERE searchvector @@ plainto_tsquery('english', @Query) ORDER BY ts_rank(searchvector, plainto_tsquery('english', @Query)) DESC";

        using var conn = _context.CreateConnection();

        return await conn.QueryAsync<Artifact>(sql, new { Query = queryText });
    }

    public async Task<Artifact> CreateAsync(Artifact artifact)
    {
        var query = "INSERT INTO artifacts (title, description, medium, yearcreated, imageurl, createdbyuserid, artistid) VALUES (@Title, @Description, @Medium, @YearCreated, @ImageUrl, @CreatedByUserId, @ArtistId) RETURNING *";

        using var conn = _context.CreateConnection();

        return await conn.QuerySingleAsync<Artifact>(query, artifact);
    }

    public async Task<bool> UpdateAsync(Artifact artifact)
    {
        var query = "UPDATE artifacts SET title = @Title, description = @Description, medium = @Medium, yearcreated = @YearCreated, imageurl = @ImageUrl WHERE id = @Id";

        using var conn = _context.CreateConnection();

        var result = await conn.ExecuteAsync(query, artifact);
        return result > 0;
        
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var query = "DELETE FROM artifacts WHERE id = @Id";
        using var conn = _context.CreateConnection();
        var result = await conn.ExecuteAsync(query, new { Id =  id });
        return result > 0;
    }
    public async Task<IEnumerable<string>> GetArtFactsAsync()
    {
        var query = "SELECT fact_text FROM art_facts";
        using var conn = _context.CreateConnection();
        return await conn.QueryAsync<string>(query);
    }
}