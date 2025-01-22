using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Database;
using Server.Features.WeeklyTimeSheet.Dtos;

namespace Server.Features.WeeklyTimeSheet;

[Route("TimeSheetHistory")]
public class TimeSheetHistoryController
{
    private TimeSheeterDbContext _dbContext;

    public TimeSheetHistoryController(TimeSheeterDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<TimeSheetHistoryDto> Get([FromQuery] DateTime minDate, [FromQuery] DateTime maxDate)
    {
        var days = await _dbContext.WorkDay
            .Where(w => w.Date >= minDate.Date && w.Date <= maxDate.Date)
            .OrderBy(w => w.Date)
            .Select(w => new TimeSheetHistoryDayDto
            {
                Date = w.Date,
                StartTime = w.StartTime,
                FinishTime = w.FinishTime
            })
            .ToListAsync();

        return new TimeSheetHistoryDto { Days = days };
    }
}
