

using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Services;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

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

    [HttpPost("login")]

    public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (result == null) return Unauthorized("Error");
        return Ok(result);
    }

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

    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        var frontendBaseUrl = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
        return Redirect($"{frontendBaseUrl}/login?error=google_not_configured");
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