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

    public OtpService(IOtpRepository repo, IEmailService emailService, IUserRepository userRepo)
    {
        _otpRepo = repo;
        _emailService = emailService;
        _userRepo = userRepo;
    }
    
    public string GenerateOtpCode()
    {
        return Random.Shared.Next(100000, 999999).ToString();
    }

    public async Task SendOtpAsync(string email, int userId, string purpose)
    {
        string otp = GenerateOtpCode();
        await _otpRepo.saveOtp(userId, otp, purpose, email);
        await _emailService.SendOtpEmailAsync(email, otp, purpose);
    }

    public async Task<UserOtp?> ValidateOtpAsync(string email, string otp, string purpose)
    {
        var user = await _userRepo.getUserByEmail(email);
        if (user is null) return null;
        
        if (purpose == "Registration" && user.IsEmailVerified == true) 
            return null;

        var otpRecord = await _otpRepo.GetLatestOtpByUserEmail(email, purpose);
        if (otpRecord is null) return null;

        if (otpRecord.IsUsed) return null;
        
        // Check if OTP matches
        if (otpRecord.Otp != otp) return null;
        
        // Check if OTP is expired
        if (otpRecord.ExpiresAt < DateTime.UtcNow) return null;
        
        return otpRecord;
    }
}