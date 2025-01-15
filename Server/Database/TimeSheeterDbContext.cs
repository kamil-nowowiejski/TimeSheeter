namespace Server.Database;

using Microsoft.EntityFrameworkCore;

public class TimeSheeterDbContext : DbContext
{
    public DbSet<WorkDay> WorkDay { get; set; } = null!;

    public TimeSheeterDbContext(DbContextOptions<TimeSheeterDbContext> options) : base(options)
    { }
}
