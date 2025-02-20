using Microsoft.AspNetCore.Mvc;
using Server.Api.Dtos;
using Server.Database;

namespace Server.Api;

[ApiController]
[Route("api/Earnings")]
public class EarningsApiController(TimeSheeterDbContext dbContext) : ControllerBase
{
    private readonly TimeSheeterDbContext _dbContext = dbContext;

    [HttpGet]
    public EarningsDto Get()
    {
        var earnings = _dbContext.Earnings.Single();
        return new EarningsDto
        {
            EarningsPerHour = earnings.EarningsPerHour,
            Currency = earnings.Currency
        };
    }

}
