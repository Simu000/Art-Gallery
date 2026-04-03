using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;

namespace aborginal_art_gallery.Services;

public interface IAuthService
{
    /// <summary>
    /// Registers a user and triggers registration OTP flow.
    /// </summary>
    /// <param name="dto">Registration payload.</param>
    /// <returns>Registration response when successful; otherwise null.</returns>
    Task<RegisterReponseDto?> RegisterAsync(RegisterDto dto);
    /// <summary>
    /// Verifies registration OTP.
    /// </summary>
    /// <param name="dto">Verification payload.</param>
    /// <returns>Verification result.</returns>
    Task<VerifyOtpResponseDto> VerifyRegistrationOtpAsync(VerifyOtpDto dto);
    /// <summary>
    /// Starts login OTP flow for a valid user.
    /// </summary>
    /// <param name="dto">Login payload.</param>
    /// <returns>Login response when successful; otherwise null.</returns>
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    /// <summary>
    /// Verifies login OTP.
    /// </summary>
    /// <param name="dto">Verification payload.</param>
    /// <returns>Verification result.</returns>
    Task<VerifyOtpResponseDto> VerifyLoginOtpAsync(VerifyOtpDto dto);
    /// <summary>
    /// Generates a JWT token for a user.
    /// </summary>
    /// <param name="user">The authenticated user.</param>
    /// <returns>Signed JWT token string.</returns>
    string GenerateJwtToken(User user);

}