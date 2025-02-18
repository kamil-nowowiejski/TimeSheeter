using Microsoft.EntityFrameworkCore;
using Server.Api;
using Server.Database;
using Vite.AspNetCore;

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
        builder.Services.AddViteServices(options =>
        {
            options.Server.Host = "localhost";
            options.Server.Port = 5174;
            options.Server.AutoRun = false;
            options.Server.Https = false;
            options.Server.PackageDirectory = "../uireact";
            options.Server.UseReactRefresh = true;
            options.Server.PackageManager = "deno";
            options.Base = "assets";
        });

        AddApplicationServices(builder.Services);

        var app = builder.Build();

        MigrateDatabase(app.Services);

        app.UseStaticFiles();

        app.MapControllers();

        if (app.Environment.IsDevelopment())
        {
            app.UseWebSockets();
            app.UseViteDevelopmentServer(true);
        }

        app.Run();
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
