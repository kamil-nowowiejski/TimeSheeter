
using Microsoft.AspNetCore.Mvc;
using Server.Api.Dtos;

namespace Server.Api;

[ApiController]
[Route("api/Earnings")]
public class EarningsApiController : ControllerBase
{
    [HttpGet]
    public EarningsDto Get()
    {
        //TODO Add config
        return new EarningsDto
        {
            EarningsPerHour = 140,
            Currency = "PLN"
        };
    }

}
