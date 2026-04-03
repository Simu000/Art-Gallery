

using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;
using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


[ApiController]
[Route("api/auth")]
/// <summary>
/// Handles authentication and OTP verification endpoints.
/// </summary>
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserRepository _userRepository;
    private readonly IOtpRepository _otpRepository;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IUserRepository userRepository, IOtpRepository otpRepository, IConfiguration configuration)
    {
        _authService = authService;
        _userRepository = userRepository;
        _otpRepository = otpRepository;
        _configuration = configuration;
    }

    /// <summary>
    /// Registers a new user and sends registration OTP.
    /// </summary>
    /// <param name="dto">Registration payload.</param>
    /// <returns>Registration result or error response.</returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto);
            if (result == null) return BadRequest(new ErrorDto
            {
                message = "Registration Falied"
            });

            return Ok(result);
        }
        catch(Exception)
        {
            return StatusCode(500, new ErrorDto
            {
                message = "Internal Server Error"
            });
        }
    }

    /// <summary>
    /// Starts login flow and sends login OTP.
    /// </summary>
    /// <param name="dto">Login credentials.</param>
    /// <returns>Login challenge response.</returns>
    [HttpPost("login")]

    public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (result == null) return Unauthorized("Error");
        return Ok(result);
    }

    /// <summary>
    /// Verifies registration OTP and issues JWT cookie.
    /// </summary>
    /// <param name="dto">OTP verification payload.</param>
    /// <returns>Verification result.</returns>
    [HttpPost("verify-otp-registration")]
    public async Task<IActionResult> verifyRegistartionOtp([FromBody] VerifyOtpDto dto)
    {
        var result = await _authService.VerifyRegistrationOtpAsync(dto);

        if (result is null || string.IsNullOrEmpty(result.Token))
        {
            return BadRequest(new ErrorDto { message = result?.Message ?? "Invalid or expired OTP" });
        }

        SetJwtCookie(result.Token!);

        return Ok(new { message = result.Message });
    }

    /// <summary>
    /// Verifies login OTP and issues JWT cookie.
    /// </summary>
    /// <param name="dto">OTP verification payload.</param>
    /// <returns>Verification result.</returns>
    [HttpPost("verify-otp-login")]
    public async Task<IActionResult> verifyLoginOtp([FromBody] VerifyOtpDto dto)
    {
        var result = await _authService.VerifyLoginOtpAsync(dto);

        if (result.success == false)
        {
            return BadRequest(new ErrorDto { message = result.Message });
        }

        SetJwtCookie(result.Token!);

        return Ok(new { message = result.Message });
    }

    /// <summary>
    /// Clears the current JWT cookie.
    /// </summary>
    /// <returns>Logout confirmation.</returns>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var isHttps = Request.IsHttps;
        Response.Cookies.Append("jwt", "", new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(-1)
        });
        return Ok(new { message = "Logged out successfully" });
    }





    private void SetJwtCookie(string token)
    {
        var isHttps = Request.IsHttps;
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)

        };

        Response.Cookies.Append("jwt", token, cookieOptions);
    }

}