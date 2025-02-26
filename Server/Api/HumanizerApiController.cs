using System.Globalization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Api;

[ApiController]
[Route("api/Humanizer")]
public class HumanizerController() : ControllerBase
{

    [HttpGet]
    public string Get(double number)
    {
        var integer = (int)number;
        var fraction = (int)( ( number - integer )*100 );
        var words = Humanizer.NumberToWordsExtension.ToWords(integer, CultureInfo.GetCultureInfo("pl-pl"));
        var fractionString = $"{fraction}/100";
        return $"{words} {fractionString}";
    }
}
