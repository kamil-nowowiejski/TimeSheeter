using Microsoft.AspNetCore.Mvc;

namespace Server.Views;

[Route("WeeklyTimeSheet")]
public class MainViewController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        return View("Views/Index.cshtml");
    }
}

