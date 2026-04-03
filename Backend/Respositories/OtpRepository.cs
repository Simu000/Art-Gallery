using Dapper;
using aborginal_art_gallery.Data;

/// <summary>
/// Provides data access operations for OTP records.
/// </summary>
public interface IOtpRepository
{
    /// <summary>
    /// Gets the latest non-used OTP for an email and purpose.
    /// </summary>
    /// <param name="email">Target email address.</param>
    /// <param name="purpose">OTP purpose.</param>
    /// <returns>The latest OTP record or null.</returns>
    Task<UserOtp?> GetLatestOtpByUserEmail(string email, string purpose);
    /// <summary>
    /// Marks an OTP as used.
    /// </summary>
    /// <param name="otpId">OTP identifier.</param>
    /// <returns>A task representing the async operation.</returns>
    Task MarkOtpAsUsed(int otpId);
    /// <summary>
    /// Marks a user email as verified.
    /// </summary>
    /// <param name="userId">User identifier.</param>
    /// <returns>A task representing the async operation.</returns>
    Task MarkUserAsVerified(int userId);
    /// <summary>
    /// Saves a newly generated OTP.
    /// </summary>
    /// <param name="userId">User identifier.</param>
    /// <param name="otp">OTP value.</param>
    /// <param name="purpose">OTP purpose.</param>
    /// <param name="email">Target email address.</param>
    /// <returns>A task representing the async operation.</returns>
    Task saveOtp(int userId, string otp, string purpose, string email);
}

/// <summary>
/// Dapper implementation of OTP repository methods.
/// </summary>
public class OtpRepository : IOtpRepository
{
    private readonly DapperContext _context;

    public OtpRepository(DapperContext context)
    {
        _context = context;
    }

    /// <inheritdoc />
    public async Task<UserOtp?> GetLatestOtpByUserEmail(string email, string purpose)
    {
        var query = @"SELECT id, user_id as UserId, otp, expires_at as ExpiresAt, is_used as IsUsed, created_at as CreatedAt, email, purpose
                      FROM user_otps 
                      WHERE LOWER(email) = LOWER(@Email) 
                        AND purpose = @Purpose 
                        AND is_used = FALSE
                      ORDER BY created_at DESC LIMIT 1";

        using var conn = _context.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<UserOtp>(query, new
        {
            Email = email,
            Purpose = purpose
        });
    }

    /// <inheritdoc />
    public async Task MarkOtpAsUsed(int otpId)
    {
        var query = "UPDATE user_otps SET is_used = TRUE WHERE id = @Id";
        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(query, new { Id = otpId });
    }

    /// <inheritdoc />
    public async Task MarkUserAsVerified(int userId)
    {
        var query = "UPDATE users SET is_email_verified = TRUE WHERE id = @userId";
        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(query, new { userId });
    }

    /// <inheritdoc />
    public async Task saveOtp(int userId, string otp, string purpose, string email)
    {
        var query = @"INSERT INTO user_otps (user_id, otp, purpose, email, expires_at, is_used, created_at)
                      VALUES (@user_id, @otp, @purpose, @email, NOW() + INTERVAL '5 minutes', FALSE, NOW())";
        using var conn = _context.CreateConnection();
        await conn.ExecuteAsync(query, new { user_id = userId, otp, purpose, email });
    }
}