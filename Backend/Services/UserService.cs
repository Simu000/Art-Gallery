


using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.Services;

public interface IUserService
{
    Task<string> UploadProfileImage(int userId, IFormFile file);
}

public class UserService : IUserService
{
    
    private readonly IUserRepository _userRepo;
    private readonly ICloudinaryService _cloudinary;

    public UserService(IUserRepository repo, ICloudinaryService cloudinary)
    {
        _userRepo = repo;
        _cloudinary = cloudinary;
    }

    public async Task<string> UploadProfileImage(int userId, IFormFile file)
    {
        var secureUrl = await _cloudinary.UploadImageAsync(file, userId);
        await _userRepo.uploadProfileImage(userId, secureUrl);
        return secureUrl;
    }

}