using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddMvc();

var app = builder.Build();
UseStaticFiles("Views/WeeklyTimesheet/static", "/weeklyTimesheet/static");
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
