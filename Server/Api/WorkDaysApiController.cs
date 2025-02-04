using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Api.Dtos;
using Server.Database;

namespace Server.Api;

[ApiController]
[Route("api/WorkDays")]
public class WorkDaysApiController : ControllerBase
{
    private TimeSheeterDbContext _dbContext;
    private readonly ICurrentDateProvider _currentDateProvider;

    public WorkDaysApiController(TimeSheeterDbContext dbContext, ICurrentDateProvider currentDateProvider)
    {
        _dbContext = dbContext;
        _currentDateProvider = currentDateProvider;
    }

    [HttpGet]
    public async Task<List<WorkDayDto>> GetWorkDays([FromQuery] DateOnly minDate, [FromQuery] DateOnly maxDate)
    {
        var days = await _dbContext.WorkDay
            .Where(w => w.Date >= minDate && w.Date <= maxDate)
            .OrderBy(w => w.Date)
            .Select(w => new WorkDayDto
            {
                Date = w.Date,
                StartTime = w.StartTime,
                FinishTime = w.FinishTime
            })
            .ToListAsync();

        return days.Select(d => new WorkDayDto
        {
            Date = d.Date,
            StartTime = d.StartTime,
            FinishTime = d.FinishTime
        }).ToList();


    }

    [HttpPost("Save")]
    public async Task<IActionResult> Save([FromBody] WorkDayDto dto)
    {
        if (dto.StartTime >= dto.FinishTime)
            return new BadRequestObjectResult("Start time must be earlier than finish time.");

        var existingWorkDay = await _dbContext.WorkDay.Where(w => w.Date == dto.Date).SingleOrDefaultAsync();

        if (existingWorkDay == null)
        {
            var workDay = new WorkDay()
            {
                Date = dto.Date,
                StartTime = dto.StartTime,
                FinishTime = dto.FinishTime
            };
            _dbContext.WorkDay.Add(workDay);
        }
        else
        {
            existingWorkDay.StartTime = dto.StartTime;
            existingWorkDay.FinishTime = dto.FinishTime;
        }
        await _dbContext.SaveChangesAsync();

        return new OkResult();
    }
}

public interface ICurrentDateProvider
{
    DateOnly GetCurrentDate() => DateOnly.FromDateTime(DateTime.Now);
}

internal class CurrentDateProvider : ICurrentDateProvider { }
