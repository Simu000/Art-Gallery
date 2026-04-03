using Dapper;
using aborginal_art_gallery.Data;
using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Repositories;

/// <summary>
/// Provides data access operations for exhibitions and exhibition-artifact links.
/// </summary>
public class ExhibitionRepository : IExhibitionRepository
{
    private readonly DapperContext _context;

    public ExhibitionRepository(DapperContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Gets all exhibitions sorted by latest start date.
    /// </summary>
    /// <returns>A list of exhibitions.</returns>
    public async Task<IEnumerable<Exhibition>> getAllExhibitions()
    {
        var query = "SELECT * FROM exhibitions ORDER BY startdate DESC";
        using var conn = _context.CreateConnection();
        return await conn.QueryAsync<Exhibition>(query);
    }

    /// <summary>
    /// Gets one exhibition by its identifier.
    /// </summary>
    /// <param name="id">The exhibition identifier.</param>
    /// <returns>The matching exhibition when found; otherwise null.</returns>
    public async Task<Exhibition?> getExhibitionById(int id)
    {
        var query = "SELECT * FROM exhibitions WHERE id = @Id";
        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<Exhibition>(query, new { Id = id });
    }
    /// <summary>
    /// Gets artifact identifiers linked to an exhibition.
    /// </summary>
    /// <param name="exhibitionId">The exhibition identifier.</param>
    /// <returns>A list of artifact identifiers.</returns>
    public async Task<List<int>> getArtifactIdsForExhibition(int exhibitionId)
    {
        var query = "SELECT artifactid FROM exhibition_artifacts WHERE exhibitionid = @ExhibitionId";
        using var conn = _context.CreateConnection();
        var ids = await conn.QueryAsync<int>(query, new { ExhibitionId = exhibitionId });
        return ids.ToList();
    }

    /// <summary>
    /// Creates an exhibition with optional artifact links.
    /// </summary>
    /// <param name="exhibition">The exhibition payload.</param>
    /// <param name="artifactIds">Artifact identifiers to link.</param>
    /// <returns>The created exhibition.</returns>
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

    /// <summary>
    /// Updates an exhibition and replaces linked artifacts.
    /// </summary>
    /// <param name="exhibition">The updated exhibition payload.</param>
    /// <param name="artifactIds">Artifact identifiers to link.</param>
    /// <returns>True when an exhibition row is updated; otherwise false.</returns>
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

            if (rows > 0)
            {
                await conn.ExecuteAsync("DELETE FROM exhibition_artifacts WHERE exhibitionid = @Id",
                    new { Id = exhibition.Id }, transaction);

                if (artifactIds.Any())
                {
                    var insertJunction = @"
                    INSERT INTO exhibition_artifacts (exhibitionid, artifactid) 
                    VALUES (@ExhibitionId, @ArtifactId)";

                    foreach (var artId in artifactIds)
                    {
                        await conn.ExecuteAsync(insertJunction,
                            new { ExhibitionId = exhibition.Id, ArtifactId = artId }, transaction);
                    }
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

    /// <summary>
    /// Deletes an exhibition by identifier.
    /// </summary>
    /// <param name="id">The exhibition identifier.</param>
    /// <returns>True when deleted; otherwise false.</returns>
    public async Task<bool> deleteExhibition(int id)
    {
        var query = "DELETE FROM exhibitions WHERE id = @Id";
        using var conn = _context.CreateConnection();
        var result = await conn.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }
}
