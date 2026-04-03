
using Microsoft.AspNetCore.Mvc;
using aborginal_art_gallery.Repositories;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using aborginal_art_gallery.DTOs;

[ApiController]
[Route("api/user")]
/// <summary>
/// Handles user profile and administration endpoints.
/// </summary>
public class UserController : ControllerBase
{
    private readonly IUserRepository _repo;
    private readonly IUserService _userService;

    private int CurrentUserId
    {
        get
        {
            var userIdClaims = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaims) || !int.TryParse(userIdClaims, out int userId)) throw new UnauthorizedAccessException("Invalid or missing user token");

            return userId;
        }
    }

    public UserController(IUserRepository repo, IUserService userServices)
    {
        _repo = repo;
        _userService = userServices;
    }


    /// <summary>
    /// Gets all users for admins.
    /// </summary>
    /// <returns>A list of users.</returns>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> getAll()
    {
        var users = await _repo.getAllUsers();
        return Ok(users);
    }

    /// <summary>
    /// Uploads the current user's profile image.
    /// </summary>
    /// <param name="file">Profile image file.</param>
    /// <returns>Upload status with image URL.</returns>
    [Authorize]
    [HttpPost("me/profile-image")]
    public async Task<IActionResult> uploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file Uploaded");
        }
        if (file.Length > 5 * 1024 * 1024) return BadRequest("File size must be less than 5MB");
        try
        {
            int userId = CurrentUserId;

            var imageUrl = await _userService.UploadProfileImage(userId, file);

            return Ok(new
            {
                success = true,
                ProfileImageUrl = imageUrl
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Uploading failed " + ex);
        }
    }


    /// <summary>
    /// Gets the currently authenticated user profile.
    /// </summary>
    /// <returns>The current user data.</returns>
    [Authorize]                  
    [HttpGet("me")]                
    public async Task<IActionResult> GetCurrentUser()
    {
        int userId = CurrentUserId;   

        var user = await _repo.GetCurrentUserAsync(userId);

        if (user == null)
            return NotFound("User not found or email not verified");

        var currentUser = new CurrentUserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
            IsEmailVerified = user.IsEmailVerified,
            CreatedAt = user.CreatedAt,
            ProfileImageUrl = user.ProfileImage   
        };

        return Ok(currentUser);
    }
}