using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Repositories;
public interface IUserRepository
{
    /// <summary>
    /// Gets all users.
    /// </summary>
    /// <returns>A list of users.</returns>
    Task<IEnumerable<User>> getAllUsers();
    /// <summary>
    /// Gets one user by identifier.
    /// </summary>
    /// <param name="id">User identifier.</param>
    /// <returns>The user when found; otherwise null.</returns>
    Task<User?> getUserById(int id);
    /// <summary>
    /// Gets one user by email.
    /// </summary>
    /// <param name="email">Email address.</param>
    /// <returns>The user when found; otherwise null.</returns>
    Task<User?> getUserByEmail(string email);
    /// <summary>
    /// Creates a user.
    /// </summary>
    /// <param name="user">User payload.</param>
    /// <returns>The created user.</returns>
    Task<User> CreateUser(User user);
    /// <summary>
    /// Updates a user.
    /// </summary>
    /// <param name="user">User payload.</param>
    /// <returns>True when updated; otherwise false.</returns>
    Task<bool> updateUser(User user);
    /// <summary>
    /// Deletes a user by identifier.
    /// </summary>
    /// <param name="id">User identifier.</param>
    /// <returns>True when deleted; otherwise false.</returns>
    Task<bool> deleteUser(int id);
    /// <summary>
    /// Soft deletes a user by identifier.
    /// </summary>
    /// <param name="id">User identifier.</param>
    /// <returns>A task representing the async operation.</returns>
    Task softDeleteUser(int id);
    /// <summary>
    /// Saves a profile image URL for user.
    /// </summary>
    /// <param name="userId">User identifier.</param>
    /// <param name="secureUrl">Hosted image URL.</param>
    /// <returns>A task representing the async operation.</returns>
    Task uploadProfileImage(int userId, string secureUrl);
    /// <summary>
    /// Gets current user profile for authenticated user id.
    /// </summary>
    /// <param name="userId">User identifier.</param>
    /// <returns>The user profile when available; otherwise null.</returns>
    Task<User?> GetCurrentUserAsync(int userId);

}