namespace Server.Features.WeeklyTimeSheet.Dtos;

public class TimeSheetHistoryDto
{
    public List<TimeSheetHistoryDayDto> Days { get; set; } = null!;
}

public class TimeSheetHistoryDayDto
{
    public DateTime Date { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? FinishTime { get; set; }
}
