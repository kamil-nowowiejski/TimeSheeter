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
    public void GetCurrentWeekTime_DifferentDaysOfWeek_ExpectedTimeRange(DateTime currentDate, WeekTimeGetDto expected)
    {
        //Arrange
        _currentDateProviderMock.Setup(x => x.GetCurrentDate()).Returns(currentDate);

        //Act
        var actual = _sut.GetCurrentWeekTime();

        //Assert
        actual.Should().BeEquivalentTo(expected);
    }

    public static IEnumerable<object[]> GetCurrentWeekTimeData => new (DateTime CurrentDate, WeekTimeGetDto Expected)[]
    {
      new(new(2024, 12, 23), GetWeekTimeDto(1)),
      new(new(2024, 12, 24), GetWeekTimeDto(1)),
      new(new(2024, 12, 25), GetWeekTimeDto(1)),
      new(new(2024, 12, 26), GetWeekTimeDto(1)),
      new(new(2024, 12, 27), GetWeekTimeDto(1)),

      new(new(2024, 12, 30), GetWeekTimeDto(2)),
      new(new(2024, 12, 31), GetWeekTimeDto(2)),
      new(new(2025, 01, 01), GetWeekTimeDto(2)),
      new(new(2025, 01, 02), GetWeekTimeDto(2)),
      new(new(2025, 01, 03), GetWeekTimeDto(2)),

      new(new(2025, 01, 04), GetWeekTimeDto(3)),
      new(new(2025, 01, 05), GetWeekTimeDto(3)),
      new(new(2025, 01, 06), GetWeekTimeDto(3)),
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
            new(){ Date = new(2025, 01, 04), StartTime = GetTime(08, 00), FinishTime = GetTime(15, 32) },
            new(){ Date = new(2025, 01, 05), StartTime = GetTime(09, 21), FinishTime = GetTime(16, 49) },
            new(){ Date = new(2025, 01, 06), StartTime = GetTime(09, 30), FinishTime = null },
    };

    private static WeekTimeGetDto GetWeekTimeDto(int weekNumber)
    {
        int[] indices = null!;
        switch (weekNumber)
        {
            case 1: indices = [0, 1, 2, 3, 4]; break;
            case 2: indices = [5, 6, 7, 8, 9]; break;
            case 3: indices = [10, 11, 12]; break;
            default: throw new ArgumentOutOfRangeException();
        }

        if (weekNumber == 1 || weekNumber == 2)
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

        return new()
        {
            Monday = GetTimeDto(0),
            Tuesday = GetTimeDto(1),
            Wendsday = GetTimeDto(2),
            Thrusday = new() { Date = new(2025, 01, 06) },
            Friday = new() { Date = new(2025, 01, 07) }
        }; 

        TimeDto GetTimeDto(int i)
            => new() { Date = WorkDays[indices[i]].Date, StartTime = WorkDays[indices[i]].StartTime, FinishTime = WorkDays[indices[i]].FinishTime };
    }

    private static TimeSpan GetTime(int hour, int minute) => TimeSpan.FromHours(hour) + TimeSpan.FromMinutes(minute);
}
