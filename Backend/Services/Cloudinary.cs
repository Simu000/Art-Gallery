using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace aborginal_art_gallery.Services;

public interface ICloudinaryService
{
    Task<string> UploadImageAsync(IFormFile file, int userId);
}

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        var cloudName = config["Cloudinary:CloudName"];
        var apiKey = config["Cloudinary:ApiKey"];
        var apiSecret = config["Cloudinary:ApiSecret"];

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(IFormFile file, int userId)
    {
        if (file.Length > 5 * 1024 * 1024) 
            throw new ArgumentException("File size must be smaller than 5 MB");

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = $"ArtGallery/profiles/{userId}",
            Transformation = new Transformation().Width(400).Height(400).Crop("fill").Gravity("face")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);
        return result.SecureUrl.ToString();
    }
}