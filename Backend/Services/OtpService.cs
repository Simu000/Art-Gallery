using aborginal_art_gallery.Models;
using aborginal_art_gallery.Repositories;

namespace aborginal_art_gallery.Services;

public interface IOtpService
{
    /// <summary>
    /// Generates a numeric one-time password.
    /// </summary>
    /// <returns>A six-digit OTP code.</returns>
    string GenerateOtpCode();
    /// <summary>
    /// Creates and sends OTP for the specified purpose.
    /// </summary>
    /// <param name="email">Target email address.</param>
    /// <param name="userId">Target user identifier.</param>
    /// <param name="purpose">OTP purpose.</param>
    /// <returns>A task representing the async operation.</returns>
    Task SendOtpAsync(string email, int userId, string purpose);
    /// <summary>
    /// Validates an OTP for email and purpose.
    /// </summary>
    /// <param name="email">Target email address.</param>
    /// <param name="otp">OTP value provided by user.</param>
    /// <param name="purpose">OTP purpose.</param>
    /// <returns>OTP record when valid; otherwise null.</returns>
    Task<UserOtp?> ValidateOtpAsync(string email, string otp, string purpose);
}

/// <summary>
/// Provides OTP generation, delivery, and validation.
/// </summary>
public class OtpService : IOtpService
{
    private readonly IOtpRepository _otpRepo;
    private readonly IEmailService _emailService;
    private readonly IUserRepository _userRepo;
    private readonly ILogger<OtpService> _logger;

    public OtpService(IOtpRepository repo, IEmailService emailService, IUserRepository userRepo, ILogger<OtpService> logger)
    {
        _otpRepo = repo;
        _emailService = emailService;
        _userRepo = userRepo;
        _logger = logger;
    }
    
    /// <inheritdoc />
    public string GenerateOtpCode()
    {
        return Random.Shared.Next(100000, 999999).ToString();
    }

    /// <inheritdoc />
    public async Task SendOtpAsync(string email, int userId, string purpose)
    {
        string otp = GenerateOtpCode();
        await _otpRepo.saveOtp(userId, otp, purpose, email);
        _logger.LogInformation("OTP generated for UserId={UserId}, Email={Email}, Purpose={Purpose}, OtpSuffix={OtpSuffix}", userId, email, purpose, otp[^2..]);
        await _emailService.SendOtpEmailAsync(email, otp, purpose);
    }

    /// <inheritdoc />
    public async Task<UserOtp?> ValidateOtpAsync(string email, string otp, string purpose)
    {
        var normalizedEmail = email.Trim().ToLower();
        var normalizedOtp = otp.Trim();

        var user = await _userRepo.getUserByEmail(normalizedEmail);
        if (user is null)
        {
            _logger.LogWarning("OTP verify failed: user not found for Email={Email}, Purpose={Purpose}", normalizedEmail, purpose);
            return null;
        }
        
        if (purpose == "Registration" && user.IsEmailVerified == true) 
        {
            _logger.LogWarning("OTP verify failed: user already verified. UserId={UserId}, Purpose={Purpose}", user.Id, purpose);
            return null;
        }

        var otpRecord = await _otpRepo.GetLatestOtpByUserEmail(normalizedEmail, purpose);
        if (otpRecord is null)
        {
            _logger.LogWarning("OTP verify failed: no active OTP found for Email={Email}, Purpose={Purpose}", normalizedEmail, purpose);
            return null;
        }

        if (otpRecord.UserId != user.Id)
        {
            _logger.LogWarning("OTP verify failed: user/email mismatch. ExpectedUserId={ExpectedUserId}, OtpUserId={OtpUserId}, Email={Email}", user.Id, otpRecord.UserId, normalizedEmail);
            return null;
        }

        if (otpRecord.IsUsed)
        {
            _logger.LogWarning("OTP verify failed: OTP already used. OtpId={OtpId}, UserId={UserId}", otpRecord.Id, otpRecord.UserId);
            return null;
        }

        var expiryUtc = otpRecord.ExpiresAt.Kind == DateTimeKind.Utc
            ? otpRecord.ExpiresAt
            : DateTime.SpecifyKind(otpRecord.ExpiresAt, DateTimeKind.Utc);
        var nowUtc = DateTime.UtcNow;
        if (expiryUtc <= nowUtc)
        {
            _logger.LogWarning(
                "OTP verify failed: expired. OtpId={OtpId}, StoredOtp={StoredOtp}, EnteredOtp={EnteredOtp}, ExpiresAtUtc={ExpiresAtUtc}, NowUtc={NowUtc}",
                otpRecord.Id,
                string.IsNullOrEmpty(otpRecord.Otp) ? "NULL_OR_EMPTY" : otpRecord.Otp,
                normalizedOtp,
                expiryUtc,
                nowUtc
            );
            return null;
        }
        
        // Ensure OTP value is not null or empty
        if (string.IsNullOrEmpty(otpRecord.Otp))
        {
            _logger.LogWarning(
                "OTP verify failed: OTP value is null or empty in database. OtpId={OtpId}, UserId={UserId}",
                otpRecord.Id,
                otpRecord.UserId
            );
            return null;
        }
        
        // Normalize stored OTP: trim and convert to string in case of database type conversion
        string storedOtpNormalized = otpRecord.Otp.Trim();
        
        // Check if OTP matches (case-sensitive for numeric strings)
        if (!string.Equals(storedOtpNormalized, normalizedOtp, StringComparison.Ordinal))
        {
            _logger.LogWarning(
                "OTP verify failed: mismatch. OtpId={OtpId}, StoredOtpLength={StoredOtpLength}, EnteredOtpLength={EnteredOtpLength}, StoredOtp={StoredOtp}, EnteredOtp={EnteredOtp}, ExpiresAtUtc={ExpiresAtUtc}, NowUtc={NowUtc}",
                otpRecord.Id,
                storedOtpNormalized.Length,
                normalizedOtp.Length,
                storedOtpNormalized,
                normalizedOtp,
                expiryUtc,
                nowUtc
            );
            return null;
        }
        
        _logger.LogInformation("OTP verified successfully. OtpId={OtpId}, UserId={UserId}, Purpose={Purpose}", otpRecord.Id, otpRecord.UserId, purpose);
        
        return otpRecord;
    }
}