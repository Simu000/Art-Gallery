
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using aborginal_art_gallery.Models;
using aborginal_art_gallery.Services;
using Microsoft.Extensions.Configuration;

namespace Backend.Tests.Services;

public class AuthServiceTests
{
    [Fact]
    public void GenerateJwtToken_ShouldCreateToken_ForValidUser()
    {
        var settings = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "UnitTestSecretKey_AborginalArtGallery_1234567890"
        };

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();

        var service = new AuthService(config, null!, null!, null!, null!);
        var user = new User
        {
            Id = 99,
            FirstName = "Test",
            Email = "test@example.com",
            Role = "User"
        };

        var token = service.GenerateJwtToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        Assert.False(string.IsNullOrWhiteSpace(token));
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.NameIdentifier && c.Value == "99");
        Assert.Contains(jwt.Claims, c => c.Type == ClaimTypes.Email && c.Value == "test@example.com");
    }
}
