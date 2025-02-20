using System.ComponentModel.DataAnnotations;

namespace Server.Database;

public class Earnings
{
    [Key]
    public int Id { get; set; }
    public double EarningsPerHour { get; set; }
    public string Currency { get; set; } = null!;
}

