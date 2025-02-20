using Microsoft.EntityFrameworkCore;

namespace Server.Database;

public class TimeSheeterDbContext : DbContext
{
    public DbSet<WorkDay> WorkDay { get; set; } = null!;
    public DbSet<Earnings> Earnings { get; set; } = null!;
    public DbSet<InvoiceTemplate> InvoiceTemplates { get; set; } = null!;

    public TimeSheeterDbContext(DbContextOptions<TimeSheeterDbContext> options) : base(options)
    { }
}
