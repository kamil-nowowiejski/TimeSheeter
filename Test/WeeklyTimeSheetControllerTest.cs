using Microsoft.EntityFrameworkCore;
using Server.Database;
using Server.Features.WeeklyTimeSheet.Dtos;
using Server.Features.WeeklyTimeSheet;
using FluentAssertions;
using Moq;

namespace Test;

public class WeeklyTimeSheetContollerTest : IDisposable
{
    private WeeklyTimeSheetController _sut;
    private TimeSheeterDbContext _context;
    private Mock<ICurrentDateProvider> _currentDateProviderMock = new();

    public WeeklyTimeSheetContollerTest()
    {
        var options = new DbContextOptionsBuilder<TimeSheeterDbContext>()
            .UseInMemoryDatabase("TestDb")
            .Options;
        _context = new TimeSheeterDbContext(options);
        _sut = new(_context, _currentDateProviderMock.Object);
        _context.WorkDay.AddRange(WorkDays);
        _context.SaveChanges();
    }
    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Theory]
    [MemberData(nameof(GetCurrentWeekTimeData))]
    public async Task GetCurrentWeekTime_DifferentDaysOfWeek_ExpectedTimeRange(DateTime currentDate, WeekTimeGetDto expected)
    {
        //Arrange
        _currentDateProviderMock.Setup(x => x.GetCurrentDate()).Returns(currentDate);

        //Act
        var actual = await _sut.GetCurrentWeekTime();

        //Assert
        actual.Value.Should().BeEquivalentTo(expected);
    }

    public static IEnumerable<object[]> GetCurrentWeekTimeData => new (DateTime CurrentDate, WeekTimeGetDto Expected)[]
    {
      new(new(2024, 12, 23), GetWeekTimeDto(1)),
      new(new(2024, 12, 24), GetWeekTimeDto(1)),
      new(new(2024, 12, 25), GetWeekTimeDto(1)),
      new(new(2024, 12, 26), GetWeekTimeDto(1)),
      new(new(2024, 12, 27), GetWeekTimeDto(1)),
      new(new(2024, 12, 28), GetWeekTimeDto(1)),
      new(new(2024, 12, 29), GetWeekTimeDto(1)),

      new(new(2024, 12, 30), GetWeekTimeDto(2)),
      new(new(2024, 12, 31), GetWeekTimeDto(2)),
      new(new(2025, 01, 01), GetWeekTimeDto(2)),
      new(new(2025, 01, 02), GetWeekTimeDto(2)),
      new(new(2025, 01, 03), GetWeekTimeDto(2)),
      new(new(2025, 01, 04), GetWeekTimeDto(2)),
      new(new(2025, 01, 05), GetWeekTimeDto(2)),

      new(new(2025, 01, 06), GetWeekTimeDto(3)),
      new(new(2025, 01, 07), GetWeekTimeDto(3)),
      new(new(2025, 01, 08), GetWeekTimeDto(3)),
      new(new(2025, 01, 09), GetWeekTimeDto(3)),
      new(new(2025, 01, 10), GetWeekTimeDto(3)),
      new(new(2025, 01, 11), GetWeekTimeDto(3)),
      new(new(2025, 01, 12), GetWeekTimeDto(3)),

      new(new(2025, 01, 13), GetWeekTimeDto(4)),
      new(new(2025, 01, 14), GetWeekTimeDto(4)),
      new(new(2025, 01, 15), GetWeekTimeDto(4)),
      new(new(2025, 01, 16), GetWeekTimeDto(4)),
      new(new(2025, 01, 17), GetWeekTimeDto(4)),
      new(new(2025, 01, 18), GetWeekTimeDto(4)),
      new(new(2025, 01, 19), GetWeekTimeDto(4)),
    }.Select(x => new object[] { x.CurrentDate, x.Expected });

    private static IReadOnlyList<WorkDay> WorkDays { get; } = new WorkDay[]
    {
       // week 1      
       new(){ Date = new(2024, 12, 23), StartTime = GetTime(07, 30), FinishTime = GetTime(15, 30) },
       new(){ Date = new(2024, 12, 24), StartTime = GetTime(08, 00), FinishTime = GetTime(17, 30) },
       new(){ Date = new(2024, 12, 25), StartTime = null, FinishTime = null },
       new(){ Date = new(2024, 12, 26), StartTime = null, FinishTime = null },
       new(){ Date = new(2024, 12, 27), StartTime = GetTime(08, 00), FinishTime = GetTime(14, 00) },

       // week 2
       new(){ Date = new(2024, 12, 30), StartTime = GetTime(07, 01), FinishTime = GetTime(15, 41) },
       new(){ Date = new(2024, 12, 31), StartTime = GetTime(08, 00), FinishTime = GetTime(17, 30) },
       new(){ Date = new(2025, 01, 01), StartTime = null, FinishTime = null },
       new(){ Date = new(2025, 01, 02), StartTime = GetTime(08, 01), FinishTime = GetTime(15, 30) },
       new(){ Date = new(2025, 01, 03), StartTime = GetTime(08, 41), FinishTime = GetTime(15, 30) },
       
       // week 3
       new(){ Date = new(2025, 01, 06), StartTime = GetTime(08, 00), FinishTime = GetTime(15, 32) },
       new(){ Date = new(2025, 01, 07), StartTime = GetTime(09, 21), FinishTime = GetTime(16, 49) },
       new(){ Date = new(2025, 01, 08), StartTime = GetTime(09, 30), FinishTime = null },
    };

    private static WeekTimeGetDto GetWeekTimeDto(int weekNumber)
    {
        if (weekNumber == 1)
        {
            return new()
            {
                Monday = GetTimeDto(0),
                Tuesday = GetTimeDto(1),
                Wendsday = GetTimeDto(2),
                Thrusday = GetTimeDto(3),
                Friday = GetTimeDto(4)
            };
        }

        if (weekNumber == 2)
        {
            return new()
            {
                Monday = GetTimeDto(5),
                Tuesday = GetTimeDto(6),
                Wendsday = GetTimeDto(7),
                Thrusday = GetTimeDto(8),
                Friday = GetTimeDto(9)
            };
        }

        if (weekNumber == 3)
        {
            return new()
            {
                Monday = GetTimeDto(10),
                Tuesday = GetTimeDto(11),
                Wendsday = GetTimeDto(12),
                Thrusday = new() { Date = new(2025, 01, 9) },
                Friday = new() { Date = new(2025, 01, 10) }
            };
        }

        if (weekNumber == 4)
        {
            return new()
            {
                Monday = new() { Date = new(2025, 01, 13) },
                Tuesday = new() { Date = new(2025, 01, 14) },
                Wendsday = new() { Date = new(2025, 01, 15) },
                Thrusday = new() { Date = new(2025, 01, 16) },
                Friday = new() { Date = new(2025, 01, 17) }
            };
        }

        throw new ArgumentOutOfRangeException();

        TimeDto GetTimeDto(int i)
            => new() { Date = WorkDays[i].Date, StartTime = WorkDays[i].StartTime, FinishTime = WorkDays[i].FinishTime };
    }

    private static TimeSpan GetTime(int hour, int minute) => TimeSpan.FromHours(hour) + TimeSpan.FromMinutes(minute);
}
