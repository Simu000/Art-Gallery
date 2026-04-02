using MailKit.Net.Smtp;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtpEmailAsync(string toEmail, string Otp, string purpose)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Aborginal Art Gallery", _config["Email:From"]));
        message.To.Add(new MailboxAddress("", toEmail));

        message.Subject = $"Your {purpose} Otp Code";

        message.Body = new TextPart("html")
        {
            Text = $@"
        <div style='font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;'>
            <div style='max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.1);'>
                
                <h2 style='color:#333;'>🔐 OTP Verification</h2>
                
                <p style='color:#555; font-size:16px;'>
                    Hello,<br/>
                    Use the following OTP to complete your {purpose}:
                </p>

                <div style='margin:20px 0;'>
                    <span style='display:inline-block; font-size:28px; letter-spacing:5px; background:#000; color:#fff; padding:15px 25px; border-radius:8px;'>
                        {Otp}
                    </span>
                </div>

                <p style='color:#999; font-size:14px;'>
                    This OTP will expire in <b>5 minutes</b>.
                </p>

                <hr style='margin:20px 0; border:none; border-top:1px solid #eee;' />

                <p style='font-size:12px; color:#aaa;'>
                    If you did not request this, please ignore this email.
                </p>

                <p style='font-size:12px; color:#aaa;'>
                    © Aborginal Art Gallery
                </p>

            </div>
        </div>"
        };

        using var client = new SmtpClient();

        await client.ConnectAsync(_config["Email:SmtpHost"], int.Parse(_config["Email:SmtpPort"]), true);
        await client.AuthenticateAsync(_config["Email:Username"], _config["Email:Password"]);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

}