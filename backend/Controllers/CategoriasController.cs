using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Route_Books_api.Data;
using Route_Books_api.Services;

namespace Route_Books_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriasController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/Categorias/mais-usadas
    [HttpGet("mais-usadas")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetTresCategoriasMaisUsadas()
    {
        var anoConsultado = DateTime.UtcNow.Year;

        var categorias = await CategoriaQueries.GetTresMaisUsadasAsync(context, anoConsultado);
        var resultado = categorias.Select(item => new
        {
            categoriaId = item.CategoriaId,
            nome = item.Nome,
            totalPosts = item.TotalPosts
        });

        return Ok(new { ano = anoConsultado, categorias = resultado });
    }
}
