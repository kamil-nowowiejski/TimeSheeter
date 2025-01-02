using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers.Index;

[ApiController]
[Route("[controller]")]
public class WeeklyTimeSheetController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return View();
        
    }
}
