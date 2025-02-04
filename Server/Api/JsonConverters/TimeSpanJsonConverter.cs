using System.Text.Json;
using System.Text.Json.Serialization;

namespace Server.Api.JsonConverters;

public class TimeSpanJsonConverter : JsonConverter<TimeSpan?>
{
    public override TimeSpan? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var rawValue = reader.GetString()!;
        if(string.IsNullOrEmpty(rawValue))
            return null;

        var split = rawValue.Split(':');
        var hours = int.Parse(split[0]);
        var minutes = int.Parse(split[1]);
        return TimeSpan.FromHours(hours) + TimeSpan.FromMinutes(minutes);
        
    }

    public override void Write(Utf8JsonWriter writer, TimeSpan? value, JsonSerializerOptions options)
    {
        if(value == null)
            return;

        var hours = value.Value.Hours.ToString("00");
        var minutes = value.Value.Minutes.ToString("00");
        var stringValue = $"{hours}:{minutes}";
        writer.WriteStringValue(stringValue);
    }
}
        
