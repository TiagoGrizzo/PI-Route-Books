using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
namespace Route_Books_api.Controllers;
[ApiController]
[Route("api/temporadas")]
public class TemporadasController(ApplicationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Atuais() {
        var hoje = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTimeOffset.UtcNow, "America/Sao_Paulo").Date;
        var destinos = await db.temporadasDestinos.AsNoTracking()
            .Where(d => d.Mes == hoje.Month && d.DiaInicio <= hoje.Day && d.DiaFim >= hoje.Day)
            .OrderBy(d => d.Ordem).Take(4).ToListAsync();
        return Ok(new { mes = hoje.Month, data = hoje.ToString("yyyy-MM-dd"), destinos });
    }
}
