namespace Server.Features.WeeklyTimeSheet.Dtos;

public class WeekTimeGetDto
{
    public TimeDto Monday { get; set; } = null!;
    public TimeDto Tuesday { get; set; } = null!;
    public TimeDto Wendsday { get; set; } = null!;
    public TimeDto Thrusday { get; set; } = null!;
    public TimeDto Friday { get; set; } = null!;
}

public class TimeDto
{
    public DateTime Date { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? FinishTime { get; set; }
}
