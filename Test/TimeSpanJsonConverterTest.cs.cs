using Server.Features.WeeklyTimeSheet.Dtos;

public class TimeSpanJsonConverterTest
{
    [Fact]
    public void xd()
    {
        var dto = new SaveTimeDto()
        {
            Date = DateTime.Now,
            StartTime = TimeSpan.FromDays(4) + TimeSpan.FromHours(3) + TimeSpan.FromMinutes(48),
        };

        var json = System.Text.Json.JsonSerializer.Serialize(dto);

        var deserialized = System.Text.Json.JsonSerializer.Deserialize<SaveTimeDto>(json);
    }

    [Fact]
    public void xd2()
    {
        var ss = @"{
  ""date"": ""2025-01-20T10:22:26.360Z"",
  ""startTime"": ""07:03"",
  ""finishTime"": """"
}";

        var dto = System.Text.Json.JsonSerializer.Deserialize<SaveTimeDto>(ss);
    }

}
