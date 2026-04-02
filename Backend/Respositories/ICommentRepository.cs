using aborginal_art_gallery.Models;
using aborginal_art_gallery.DTOs;

namespace aborginal_art_gallery.Repositories;

public interface ICommentRepository
{
    Task<IEnumerable<CommentDto>> getCommentsByArtifact(int artifactId);
    Task<Comment> createComment(Comment comment);
    Task<bool> deleteComment(int commentId, int currentUserId);   // ownership check
}
