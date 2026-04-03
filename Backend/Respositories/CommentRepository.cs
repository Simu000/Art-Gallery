using Dapper;
using aborginal_art_gallery.Data;
using aborginal_art_gallery.Models;
using aborginal_art_gallery.DTOs;

namespace aborginal_art_gallery.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly DapperContext _context;

    public CommentRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CommentDto>> getCommentsByArtifact(int artifactId)
    {
        var query = @"
            SELECT c.id,
                   c.artifactid,
                   c.userid,
                   u.firstname AS userfirstname,
                   u.lastname AS userlastname,
                   u.profileimage AS userprofileimage,
                   c.text,
                   c.createdat
            FROM comments c
            JOIN users u ON c.userid = u.id
            WHERE c.artifactid = @ArtifactId
            ORDER BY c.createdat DESC";

        using var conn = _context.CreateConnection();
        return await conn.QueryAsync<CommentDto>(query, new { ArtifactId = artifactId });
    }

    public async Task<Comment> createComment(Comment comment)
    {
        var query = @"
            INSERT INTO comments (artifactid, userid, text)
            VALUES (@ArtifactId, @UserId, @Text)
            RETURNING *";

        using var conn = _context.CreateConnection();
        return await conn.QuerySingleAsync<Comment>(query, comment);
    }

    public async Task<bool> deleteComment(int commentId, int currentUserId)
    {
        var query = @"
            DELETE FROM comments 
            WHERE id = @CommentId 
              AND (userid = @CurrentUserId)";

        using var conn = _context.CreateConnection();
        
 
  
        var result = await conn.ExecuteAsync(query, 
            new { CommentId = commentId, CurrentUserId = currentUserId});
        
        return result > 0;
    }
}