


using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.Services;

public interface IUserService
{
    /// <summary>
    /// Uploads and saves profile image for a user.
    /// </summary>
    /// <param name="userId">The user identifier.</param>
    /// <param name="file">The image file.</param>
    /// <returns>The hosted image URL.</returns>
    Task<string> UploadProfileImage(int userId, IFormFile file);
}

/// <summary>
/// Provides user-related service operations.
/// </summary>
public class UserService : IUserService
{
    
    private readonly IUserRepository _userRepo;
    private readonly ICloudinaryService _cloudinary;

    public UserService(IUserRepository repo, ICloudinaryService cloudinary)
    {
        _userRepo = repo;
        _cloudinary = cloudinary;
    }

    /// <inheritdoc />
    public async Task<string> UploadProfileImage(int userId, IFormFile file)
    {
        var secureUrl = await _cloudinary.UploadImageAsync(file, userId);
        await _userRepo.uploadProfileImage(userId, secureUrl);
        return secureUrl;
    }

}