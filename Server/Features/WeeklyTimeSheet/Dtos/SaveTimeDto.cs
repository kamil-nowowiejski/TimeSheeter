using System.ComponentModel.DataAnnotations;

namespace Server.Features.WeeklyTimeSheet.Dtos;

public class SaveTimeDto
{
    [Required]
    public DateTime StartTime { get; set; }

    [Required]
    public DateTime FinishTime { get; set; }
}
