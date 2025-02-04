using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Server.Api.JsonConverters;

namespace Server.Api.Dtos;

public class WorkDayDto
{
    [Required] 
    [JsonConverter(typeof(DateOnlyJsonConverter))]
    public DateOnly Date { get; set; }

    [JsonConverter(typeof(TimeSpanJsonConverter))]
    public TimeSpan? StartTime { get; set; }

    [JsonConverter(typeof(TimeSpanJsonConverter))]
    public TimeSpan? FinishTime { get; set; }
}
