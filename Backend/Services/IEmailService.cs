public interface IEmailService
{
    Task SendOtpEmailAsync(string toEmail, string Otp, string email);
}