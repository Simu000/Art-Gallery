public class UserOtp
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Otp { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public bool IsUsed { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Purpose { get; set; } = "";
    public string Email { get; set; } = "";
}