using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Server.Features.WeeklyTimeSheet.Dtos;

public class SaveTimeDto
{
    [Required] 
    public DateTime Date { get; set; }

    [JsonConverter(typeof(TimeSpanJsonConverter))]
    public TimeSpan? StartTime { get; set; }

    [JsonConverter(typeof(TimeSpanJsonConverter))]
    public TimeSpan? FinishTime { get; set; }
}
