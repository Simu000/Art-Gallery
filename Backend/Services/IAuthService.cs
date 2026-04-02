using aborginal_art_gallery.DTOs;

namespace aborginal_art_gallery.Services;

public interface IAuthService
{

    Task<RegisterReponseDto?> RegisterAsync(RegisterDto dto);
    Task<VerifyOtpResponseDto> VerifyRegistrationOtpAsync(VerifyOtpDto dto);

    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    Task<VerifyOtpResponseDto> VerifyLoginOtpAsync(VerifyOtpDto dto);

}