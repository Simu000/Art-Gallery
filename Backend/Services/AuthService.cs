using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;
using aborginal_art_gallery.Repositories;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;

namespace aborginal_art_gallery.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;
    private readonly IOtpService _otpService;
    private readonly IOtpRepository _otpRepo;

    public AuthService(IConfiguration config, UserRepository userRepo, IEmailService emailservice, IOtpService otpService, IOtpRepository otprepo)
    {
        _config = config;
        _userRepo = userRepo;
        _emailService = emailservice;
        _otpService = otpService;
        _otpRepo = otprepo;
    }

    public async Task<RegisterReponseDto?> RegisterAsync(RegisterDto dto)
    {
        if (await _userRepo.getUserByEmail(dto.Email) != null) return null;
        if (dto is null)
        {
            return null;
        }
        string purpose = "Registration";

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName ?? "",
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "User",
            IsEmailVerified = false,
            Status = "Active"
        };

        var newUser = await _userRepo.CreateUser(user);
        await _otpService.SendOtpAsync(newUser.Email, newUser.Id, purpose);

        return new RegisterReponseDto
        {
            success = true,
            message = "Otp Send to your email",
            email = newUser.Email,
            UserId = newUser.Id
        };
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.getUserByEmail(dto.Email);
        if (user == null) return null;

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return null;

        string purpose = "Login";
        await _otpService.SendOtpAsync(user.Email, user.Id, purpose);

        return new LoginResponseDto
        {
            Requires2FA = true,
            Message = "Otp Send to your Email"
        };
    }

    public async Task<VerifyOtpResponseDto> VerifyRegistrationOtpAsync(VerifyOtpDto dto)
    {
        var email = dto.email.Trim();
        var otp = dto.otp.Trim();
        var otpRecord = await _otpService.ValidateOtpAsync(email, otp, "Registration");
        if (otpRecord is null)
        {
            return new VerifyOtpResponseDto
            {
                success = false,
                Message = "Invalid or Expired Otp"
            };
        }

        var user = await _userRepo.getUserByEmail(email);
        if (user is null)
        {
            return new VerifyOtpResponseDto
            {
                success = false,
                Message = "User not found"
            };
        }
        
        var token = GenerateJwtToken(user);
        await _otpRepo.MarkUserAsVerified(user.Id);
        await _otpRepo.MarkOtpAsUsed(otpRecord.Id);

        return new VerifyOtpResponseDto
        {
            success = true,
            Message = "Registration Verified successfully",
            Token = token,
            Email = user.Email
        };
    }

    public async Task<VerifyOtpResponseDto> VerifyLoginOtpAsync(VerifyOtpDto dto)
    {
        var email = dto.email.Trim();
        var otp = dto.otp.Trim();
        var otpRecord = await _otpService.ValidateOtpAsync(email, otp, "Login");
        if (otpRecord is null)
        {
            return new VerifyOtpResponseDto
            {
                success = false,
                Message = "Invalid or Expired Otp"
            };
        }
        
        var user = await _userRepo.getUserByEmail(email);
        if (user is null)
        {
            return new VerifyOtpResponseDto
            {
                success = false,
                Message = "User not found"
            };
        }
        
        var token = GenerateJwtToken(user);
        await _otpRepo.MarkOtpAsUsed(otpRecord.Id);

        return new VerifyOtpResponseDto
        {
            success = true,
            Message = "Login Successfully",
            Token = token,
            Email = user.Email
        };
    }

    public string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FirstName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "MySecretKeyIfItIsUnableToFetchFromAppSettings.Json!@#$%^&*()"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "AborginalArtGallery",
            audience: "AborginalArtGallery",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}