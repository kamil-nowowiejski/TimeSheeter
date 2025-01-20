using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Server.Database;
using Server.Features.WeeklyTimeSheet;

namespace Server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddControllers();
        builder.Services.AddMvc();
        builder.Services.AddDbContext<TimeSheeterDbContext>(options =>
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            var path = Environment.GetFolderPath(folder);
            var dbPath = Path.Join(path, "timesheeter.db");
            options.UseSqlite($"Data Source={dbPath}");
        });

        AddApplicationServices(builder.Services);

        var app = builder.Build();

        MigrateDatabase(app.Services);

        UseStaticFiles("Features/WeeklyTimeSheet/View/static", "/weeklyTimesheet/static");
        app.MapControllers();

        app.Run();

        void UseStaticFiles(string filesPath, string requestPath)
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
                        Path.Combine(builder.Environment.ContentRootPath, filesPath)),
                RequestPath = requestPath
            });
        }
    }

    private static void MigrateDatabase(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TimeSheeterDbContext>();
        dbContext.Database.Migrate();
    }

    private static void AddApplicationServices(IServiceCollection services)
    {
        services
            .AddSingleton<ICurrentDateProvider, CurrentDateProvider>();
    }
}
