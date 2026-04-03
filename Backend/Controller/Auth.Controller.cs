

using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Models;
using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
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

    /// <summary>
    /// Starts Google OAuth authentication flow.
    /// </summary>
    /// <returns>OAuth challenge response.</returns>
    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        var googleClientId = _configuration["Authentication:Google:ClientId"];
        var googleClientSecret = _configuration["Authentication:Google:ClientSecret"];
        var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
        if (string.IsNullOrWhiteSpace(googleClientId) || string.IsNullOrWhiteSpace(googleClientSecret))
        {
            return Redirect($"{frontendBaseUrl}/login?error=google_not_configured");
        }

        var callbackUrl = Url.Action(nameof(GoogleCallback), "Auth", null, Request.Scheme);
        var properties = new AuthenticationProperties
        {
            RedirectUri = callbackUrl
        };

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    /// <summary>
    /// Handles Google OAuth callback and signs user in.
    /// </summary>
    /// <returns>Redirect response to frontend callback.</returns>
    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
        var authResult = await HttpContext.AuthenticateAsync("External");

        if (!authResult.Succeeded || authResult.Principal == null)
        {
            return Redirect($"{frontendBaseUrl}/login?error=oauth_failed");
        }

        var email = authResult.Principal.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrWhiteSpace(email))
        {
            await HttpContext.SignOutAsync("External");
            return Redirect($"{frontendBaseUrl}/login?error=oauth_failed");
        }

        var firstName = authResult.Principal.FindFirstValue(ClaimTypes.GivenName)
            ?? authResult.Principal.FindFirstValue(ClaimTypes.Name)
            ?? email.Split('@')[0];
        var lastName = authResult.Principal.FindFirstValue(ClaimTypes.Surname) ?? string.Empty;

        var user = await _userRepository.getUserByEmail(email);
        if (user == null)
        {
            user = await _userRepository.CreateUser(new User
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString("N")),
                Role = "User"
            });
            await _otpRepository.MarkUserAsVerified(user.Id);
            user.IsEmailVerified = true;
        }
        else if (!user.IsEmailVerified)
        {
            await _otpRepository.MarkUserAsVerified(user.Id);
            user.IsEmailVerified = true;
        }

        var token = _authService.GenerateJwtToken(user);
        SetJwtCookie(token);
        await HttpContext.SignOutAsync("External");

        return Redirect($"{frontendBaseUrl}/auth/callback");
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