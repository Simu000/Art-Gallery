public interface IEmailService
{
    /// <summary>
    /// Sends an OTP email.
    /// </summary>
    /// <param name="toEmail">Destination email address.</param>
    /// <param name="Otp">One-time password value.</param>
    /// <param name="email">The OTP purpose label.</param>
    /// <returns>A task representing the async operation.</returns>
    Task SendOtpEmailAsync(string toEmail, string Otp, string email);
}