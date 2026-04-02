using Dapper;
using aborginal_art_gallery.Data;
public interface IOtpRepository
{
    Task<UserOtp?> GetLatestOtpByUserEmail(string email, string purpose);
    Task MarkOtpAsUsed(int otpId);
    Task MarkUserAsVerified(int userId);
    Task saveOtp(int userId, string otp, string purpose, string email);
}

public class OtpRepository : IOtpRepository
{
    private readonly DapperContext _context;

    public OtpRepository(DapperContext context)
    {
        _context = context;
    }
    public async Task<UserOtp?> GetLatestOtpByUserEmail(string email, string purpose)
    {
        var query = @"SELECT id, user_id, otp, expires_at, is_used, created_at, email
                      FROM user_otps WHERE email = @Email AND purpose = @Purpose AND expires_at > NOW() ORDER BY
                      created_at DESC LIMIT 1";
        
        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<UserOtp>(query, new
        {
           Email = email,
           Purpose = purpose
        });
    }

    public async Task MarkOtpAsUsed(int otpId)
    {
        var query = "UPDATE user_otps SET is_used = TRUE WHERE id = @Id";
        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(query, new { Id = otpId });
    }

    public async Task MarkUserAsVerified(int userId)
    {
        var query = "UPDATE users SET is_email_verified = TRUE WHERE id = @userId";
        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(query, new { userId });
    }

    public async Task saveOtp(int userId, string otp, string purpose, string email)
    {
        var query = "INSERT INTO user_otps (user_id, otp, purpose, email) VALUES (@userId, @otp, @purpose, @email)";
        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(query, new { userId, otp, purpose, email });
    }


    // public async Task<bool> ValidateOtp(int userId, string otp)
    // {
    //     var query = "SELECT 1 FROM user_otps WHERE user_id = @userId AND otp = @otp AND expires_at > NOW() AND is_used = false";
    //     using var conn = _context.CreateConnection();
    //     var exists = await conn.ExecuteScalarAsync<bool>(query, new { userId, otp });

    //     if (exists)
    //     {
    //         await conn.ExecuteAsync("UPDATE user_otps SET is_used = true WHERE user_id = @userId AND otp = @otp", new { userId, otp });
    //     }
    //     return exists;
    // }
}