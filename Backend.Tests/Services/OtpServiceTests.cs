using Xunit;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using aborginal_art_gallery.Models;
using aborginal_art_gallery.Repositories;
using aborginal_art_gallery.Services;
using Microsoft.Extensions.Logging;
using Moq;

namespace Backend.Tests.Services;

public class OtpServiceTests
{
    [Fact]
    public void GenerateOtpCode_ShouldReturnSixDigits()
    {
        var otpRepository = new Mock<IOtpRepository>();
        var emailService = new Mock<IEmailService>();
        var userRepository = new Mock<IUserRepository>();
        var logger = new Mock<ILogger<OtpService>>();

        var service = new OtpService(otpRepository.Object, emailService.Object, userRepository.Object, logger.Object);

        var otp = service.GenerateOtpCode();

        Assert.Equal(6, otp.Length);
        Assert.True(otp.All(char.IsDigit));
    }

    [Fact]
    public async Task ValidateOtpAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        var otpRepository = new Mock<IOtpRepository>();
        var emailService = new Mock<IEmailService>();
        var userRepository = new Mock<IUserRepository>();
        var logger = new Mock<ILogger<OtpService>>();

        userRepository.Setup(x => x.getUserByEmail(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        var service = new OtpService(otpRepository.Object, emailService.Object, userRepository.Object, logger.Object);

        var result = await service.ValidateOtpAsync("missing@user.com", "123456", "Login");

        Assert.Null(result);
    }
}
