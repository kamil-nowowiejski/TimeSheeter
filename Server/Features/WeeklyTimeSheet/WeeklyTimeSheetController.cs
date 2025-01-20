using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Database;
using Server.Features.WeeklyTimeSheet.Dtos;

namespace Server.Features.WeeklyTimeSheet;

[Route("WeeklyTimeSheet")]
public class WeeklyTimeSheetController : Controller
{
    private TimeSheeterDbContext _dbContext;
    private readonly ICurrentDateProvider _currentDateProvider;

    public WeeklyTimeSheetController(TimeSheeterDbContext dbContext, ICurrentDateProvider currentDateProvider)
    {
        _dbContext = dbContext;
        _currentDateProvider = currentDateProvider;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View("Features/WeeklyTimeSheet/View/Index.cshtml");
    }

    /// <summary>
    /// Time must be passed in UTC.
    /// </summary>
    [HttpPost("SaveTime")]
    public async Task<IActionResult> SaveTime([FromBody] SaveTimeDto saveTimeDto)
    {
        if (saveTimeDto.StartTime >= saveTimeDto.FinishTime)
            return new BadRequestObjectResult("Start time must be earlier than finish time.");

        var existingWorkDay = await _dbContext.WorkDay.Where(w => w.Date == saveTimeDto.Date.Date).SingleOrDefaultAsync();

        if (existingWorkDay == null)
        {
            var workDay = new WorkDay()
            {
                Date = saveTimeDto.Date.Date,   
                StartTime = saveTimeDto.StartTime,
                FinishTime = saveTimeDto.FinishTime
            };
            _dbContext.WorkDay.Add(workDay);
        }
        else
        {
            existingWorkDay.StartTime = saveTimeDto.StartTime;
            existingWorkDay.FinishTime = saveTimeDto.FinishTime;
        }
        await _dbContext.SaveChangesAsync();

        return new OkResult();
    }

    /// <summary>
    /// Time is returned in UTC.
    /// </summary>
    [HttpGet("GetCurrentWeekTime")]
    public async Task<ActionResult<WeekTimeGetDto>> GetCurrentWeekTime()
    {
        var currentDate = _currentDateProvider.GetCurrentDate();
        var daysToGoBack = currentDate.DayOfWeek == DayOfWeek.Sunday ? 6 : (int)currentDate.DayOfWeek - 1;
        var mondayDate = currentDate - TimeSpan.FromDays(daysToGoBack);
        var fridayDate = mondayDate + TimeSpan.FromDays(5);

        var workDays = await _dbContext.WorkDay
            .Where(w => w.Date >= mondayDate && w.Date <= fridayDate)
            .ToListAsync();

        return new WeekTimeGetDto()
        {
            Monday = GetTimeDto(0),
            Tuesday = GetTimeDto(1),
            Wendsday = GetTimeDto(2),
            Thrusday = GetTimeDto(3),
            Friday = GetTimeDto(4)
        };

        TimeDto GetTimeDto(int index)
        {
            if (index >= workDays.Count())
                return new() { Date = mondayDate + TimeSpan.FromDays(index) };
            return new()
            {
                Date = workDays[index].Date,
                StartTime = workDays[index].StartTime,
                FinishTime = workDays[index].FinishTime
            };
        }
    }

}

public interface ICurrentDateProvider
{
    DateTime GetCurrentDate() => DateTime.Now.Date;
}

internal class CurrentDateProvider : ICurrentDateProvider { }
