using aborginal_art_gallery.Models;
using aborginal_art_gallery.Repositories;

namespace aborginal_art_gallery.Services;

public interface IOtpService
{
    string GenerateOtpCode();
    Task SendOtpAsync(string email, int userId, string purpose);
    Task<UserOtp?> ValidateOtpAsync(string email, string otp, string purpose);
}

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
    
    public string GenerateOtpCode()
    {
        return Random.Shared.Next(100000, 999999).ToString();
    }

    public async Task SendOtpAsync(string email, int userId, string purpose)
    {
        string otp = GenerateOtpCode();
        await _otpRepo.saveOtp(userId, otp, purpose, email);
        _logger.LogInformation("OTP generated for UserId={UserId}, Email={Email}, Purpose={Purpose}, OtpSuffix={OtpSuffix}", userId, email, purpose, otp[^2..]);
        await _emailService.SendOtpEmailAsync(email, otp, purpose);
    }

    public async Task<UserOtp?> ValidateOtpAsync(string email, string otp, string purpose)
    {
        var normalizedEmail = email.Trim();
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

        if (otpRecord.IsUsed)
        {
            _logger.LogWarning("OTP verify failed: OTP already used. OtpId={OtpId}, UserId={UserId}", otpRecord.Id, otpRecord.UserId);
            return null;
        }
        
        // Check if OTP matches
        if (!string.Equals(otpRecord.Otp?.Trim(), normalizedOtp, StringComparison.Ordinal))
        {
            _logger.LogWarning("OTP verify failed: mismatch. OtpId={OtpId}, EnteredLength={EnteredLength}, StoredLength={StoredLength}", otpRecord.Id, normalizedOtp.Length, otpRecord.Otp?.Trim().Length ?? 0);
            return null;
        }
        
        _logger.LogInformation("OTP verified successfully. OtpId={OtpId}, UserId={UserId}, Purpose={Purpose}", otpRecord.Id, otpRecord.UserId, purpose);
        
        return otpRecord;
    }
}