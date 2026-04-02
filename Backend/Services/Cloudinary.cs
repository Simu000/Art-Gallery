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
        var ApiKey =  config["Coudinary:ApiKey"];
        var ApiSecret = config["Coudinary:ApiSecret"];

        Console.WriteLine(cloudName + ApiKey + ApiSecret);
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );

        

        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(IFormFile file, int userId)
    {

        if(file.Length > 5 * 1024 * 1024) throw new ArgumentException("File lenght must be smaller than 5 Mb");

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = $"ArtGallery/profiles/{userId}",
            Transformation = new Transformation().Width(400).Height(400).Crop("fill").Gravity("face")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        Console.WriteLine(result.SecureUrl.ToString());

        return result.SecureUrl.ToString();
    }
}