using System.ComponentModel.DataAnnotations;

namespace Server.Database;

public class WorkDay
{
    [Key]
    public DateOnly Date {get;set;}
    public TimeSpan? StartTime { get; set; } 
    public TimeSpan? FinishTime { get; set; }
}

