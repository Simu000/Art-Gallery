using aborginal_art_gallery.Models;
using aborginal_art_gallery.DTOs;

namespace aborginal_art_gallery.Repositories;

public interface ICommentRepository
{
    /// <summary>
    /// Gets comments for an artifact.
    /// </summary>
    /// <param name="artifactId">Artifact identifier.</param>
    /// <returns>Comment DTO list.</returns>
    Task<IEnumerable<CommentDto>> getCommentsByArtifact(int artifactId);
    /// <summary>
    /// Creates a comment.
    /// </summary>
    /// <param name="comment">Comment payload.</param>
    /// <returns>The created comment.</returns>
    Task<Comment> createComment(Comment comment);
    /// <summary>
    /// Deletes a comment if owned by current user.
    /// </summary>
    /// <param name="commentId">Comment identifier.</param>
    /// <param name="currentUserId">Current user identifier.</param>
    /// <returns>True when deleted; otherwise false.</returns>
    Task<bool> deleteComment(int commentId, int currentUserId);   // ownership check
}
