using Microsoft.AspNetCore.Mvc;
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
        if (IsInTheSameDay(saveTimeDto.StartTime, saveTimeDto.FinishTime) == false)
            return new BadRequestObjectResult("Start time and finish time must be in the same day");

        var workDay = new WorkDay()
        {
            Date = saveTimeDto.StartTime.Date,
            StartTime = saveTimeDto.StartTime.TimeOfDay,
            FinishTime = saveTimeDto.FinishTime.TimeOfDay
        };

        _dbContext.WorkDay.Add(workDay);
        await _dbContext.SaveChangesAsync();

        return new OkResult();

        bool IsInTheSameDay(DateTime startTime, DateTime finishTime) => startTime.Date.Equals(finishTime.Date);
    }

    /// <summary>
    /// Time is returned in UTC.
    /// </summary>
    [HttpGet]
    public  Task<ActionResult<WeekTimeGetDto>> GetCurrentWeekTime()
    { 
        throw new NotImplementedException();
    }

}

public interface ICurrentDateProvider
{
    DateTime GetCurrentDate() => DateTime.Now.Date;
}

