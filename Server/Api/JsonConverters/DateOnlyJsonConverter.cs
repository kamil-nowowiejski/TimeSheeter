using System.Text.Json;
using System.Text.Json.Serialization;

namespace Server.Api.JsonConverters;

public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var rawValue = reader.GetString()!;
        if (string.IsNullOrEmpty(rawValue))
            throw new InvalidOperationException("Date required parameter is not provided.");

        var split = rawValue.Split('-');
        var year = int.Parse(split[0]);
        var month = int.Parse(split[1]);
        var day = int.Parse(split[2]);
        return new DateOnly(year, month, day);
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        var dateString = $"{value.Year}-{value.Month}-{value.Day}";
        writer.WriteStringValue(dateString);
    }
}
