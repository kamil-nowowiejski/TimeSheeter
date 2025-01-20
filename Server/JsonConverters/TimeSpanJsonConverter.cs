using System.Text.Json;
using System.Text.Json.Serialization;

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
        throw new NotImplementedException();
    }
}
        
