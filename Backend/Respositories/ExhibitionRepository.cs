using Dapper;
using aborginal_art_gallery.Data;
using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Repositories;

public class ExhibitionRepository : IExhibitionRepository
{
    private readonly DapperContext _context;

    public ExhibitionRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Exhibition>> getAllExhibitions()
    {
        var query = "SELECT * FROM exhibitions ORDER BY startdate DESC";
        using var conn = _context.CreateConnection();
        return await conn.QueryAsync<Exhibition>(query);
    }

    public async Task<Exhibition?> getExhibitionById(int id)
    {
        var query = "SELECT * FROM exhibitions WHERE id = @Id";
        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<Exhibition>(query, new { Id = id });
    }

    public async Task<Exhibition> createExhibition(Exhibition exhibition, List<int> artifactIds)
    {
        using var conn = _context.CreateConnection();
        conn.Open();
        using var transaction = conn.BeginTransaction();

        try
        {
            // Insert exhibition
            var insertEx = @"
            INSERT INTO exhibitions (name, description, startdate, enddate, location, 
                                     coverimageurl, createdbyuserid)
            VALUES (@Name, @Description, @StartDate, @EndDate, @Location, 
                    @CoverImageUrl, @CreatedByUserId)
            RETURNING *";

            var created = await conn.QuerySingleAsync<Exhibition>(insertEx, exhibition, transaction);

            if (artifactIds.Any())
            {
                var insertJunction = @"
                INSERT INTO exhibition_artifacts (exhibitionid, artifactid)
                VALUES (@ExhibitionId, @ArtifactId)";

                foreach (var artId in artifactIds)
                {
                    await conn.ExecuteAsync(insertJunction,
                        new { ExhibitionId = created.Id, ArtifactId = artId }, transaction);
                }
            }

            transaction.Commit();
            return created;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> updateExhibition(Exhibition exhibition, List<int> artifactIds)
    {
        using var conn = _context.CreateConnection();

        conn.Open();
        using var transaction = conn.BeginTransaction();

        try
        {
            // Update exhibition
            var updateSql = @"
            UPDATE exhibitions 
            SET name = @Name, description = @Description, startdate = @StartDate, 
                enddate = @EndDate, location = @Location, 
                coverimageurl = @CoverImageUrl
            WHERE id = @Id";

            var rows = await conn.ExecuteAsync(updateSql, exhibition, transaction);

            if (rows > 0 && artifactIds.Any())
            {
                await conn.ExecuteAsync("DELETE FROM exhibition_artifacts WHERE exhibition_id = @Id",
                    new { Id = exhibition.Id }, transaction);

                
                var insertJunction = @"
                INSERT INTO exhibition_artifacts (exhibitionid, artifactid) 
                VALUES (@ExhibitionId, @ArtifactId)";

                foreach (var artId in artifactIds)
                {
                    await conn.ExecuteAsync(insertJunction,
                        new { ExhibitionId = exhibition.Id, ArtifactId = artId }, transaction);
                }
            }

            transaction.Commit();
            return rows > 0;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<bool> deleteExhibition(int id)
    {
        var query = "DELETE FROM exhibitions WHERE id = @Id";
        using var conn = _context.CreateConnection();
        var result = await conn.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }
}