using aborginal_art_gallery.Data;
using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;
using Dapper;

namespace aborginal_art_gallery.Repositories;

public class UserRepository : IUserRepository
{
    private readonly DapperContext _context;

    public UserRepository(DapperContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> getAllUsers()
    {
        var query = "SELECT * FROM Users";
        using var conn = _context.CreateConnection();
        return await conn.QueryAsync<User>(query);
    }

    public async Task<User?> getUserById(int id)
    {
        var query = "SELECT * FROM Users WHERE Id = @Id";

        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(query, new { Id = id });

    }

    public async Task<User?> getUserByEmail(string email)
    {
        var query = "SELECT * FROM Users WHERE Email = @Email";

        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(query, new { Email = email });
    }
    public async Task<User> CreateUser(User user)
    {
        var query = "INSERT INTO Users (FirstName, LastName, Email, PasswordHash, PhoneNumber, Role) VALUES (@FirstName, @LastName, @Email, @PasswordHash, @PhoneNumber, @Role)  RETURNING *";

        using var conn = _context.CreateConnection();
        var createdUser = await conn.QuerySingleAsync<User>(query, user);
        return createdUser;
    }
    public async Task<bool> updateUser(User user)
    {
        var query = "UPDATE Users SET FirstName = @FirstName, LastName = @LastName, Email = @Email, PhoneNumber = @PhoneNumber, Role= @Role, Status=@Status, ModifiedAt = CURRENT_TIMESTAMP WHERE Id = @Id";

        using var conn = _context.CreateConnection();
        var result = await conn.ExecuteAsync(query, user);
        return result > 0;
    }

    public async Task<bool> deleteUser(int id)
    {
        var query = "DELETE FROM Users WHERE Id = @Id";

        using var conn = _context.CreateConnection();
        var result = await conn.ExecuteAsync(query, new { Id = id });
        return result > 0;
    }

    public async Task softDeleteUser(int id)
    {
        var query = "ALTER TABLE Users SET Status = Deactive WHERE Id = @Id";

        using var conn = _context.CreateConnection();

        await conn.ExecuteAsync(query, new { Id = id });

    }

    public async Task uploadProfileImage(int userId, string secureUrl)
    {

        var query = "UPDATE users SET profileimage = @profileimage WHERE id = @id";

        using var conn = _context.CreateConnection();

        await conn.ExecuteAsync(query, new { profileimage = secureUrl, id = userId });
    }

    public async Task<User?> GetCurrentUserAsync(int userId)
    {
        var query = "SELECT * FROM users WHERE id = @Id AND is_email_verified = true";
        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>(query, new { Id = userId });
    }

}