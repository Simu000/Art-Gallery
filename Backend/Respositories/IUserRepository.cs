using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Repositories;
public interface IUserRepository
{
    Task<IEnumerable<User>> getAllUsers();
    Task<User?> getUserById(int id);
    Task<User?> getUserByEmail(string email);
    Task<User> CreateUser(User user);
    Task<bool> updateUser(User user);
    Task<bool> deleteUser(int id);
    Task softDeleteUser(int id);
    Task uploadProfileImage(int userId, string secureUrl);
    Task<User?> GetCurrentUserAsync(int userId);

}