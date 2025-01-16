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
            if(index >= workDays.Count())
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

