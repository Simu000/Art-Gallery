

using aborginal_art_gallery.DTOs;
using aborginal_art_gallery.Services;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
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