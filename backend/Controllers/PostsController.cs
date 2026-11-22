using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Models;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;

namespace Route_Books_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int UsuarioAtual => int.TryParse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value, out var id) ? id : 0;

        public class AtualizarPostRequest
        {
            public int IdPost { get; set; }
            public string? Titulo { get; set; }
            public string? Resumo { get; set; }
            public string? Conteudo { get; set; }
            public int? TiposIdTipo { get; set; }
            public int? CategoriasIdCategoria { get; set; }
            public string? Localizacao { get; set; }
            public decimal? AvaliacaoLugar { get; set; }
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] string? busca)
        {
            var query = Route_Books_api.Services.PostQueries.Publicos(_context, UsuarioAtual);
            if (!string.IsNullOrWhiteSpace(busca))
            {
                var termo = busca.Trim();
                query = query.Where(p => (p.Titulo != null && p.Titulo.Contains(termo)) || (p.Resumo != null && p.Resumo.Contains(termo)) || (p.Localizacao != null && p.Localizacao.Contains(termo)));
            }
            return Ok(await query.OrderByDescending(p => p.DataCriacao).ToListAsync());
        }

        // GET: api/Posts/estatisticas-destinos
        [HttpGet("estatisticas-destinos")]
        [SwaggerOperation(Summary = "Top destinos mais curtidos e bem avaliados da plataforma")]
        public async Task<IActionResult> GetEstatisticasDestinos()
        {
            var postsComLocal = await _context.posts
                .AsNoTracking()
                .Where(p => p.Status == "Ativo" && !string.IsNullOrWhiteSpace(p.Localizacao))
                .Select(p => new
                {
                    Localizacao = p.Localizacao!.Trim(),
                    CurtidasPositivas = p.Curtidas.Count(c => c.Valor == 1),
                    Avaliacao = p.AvaliacaoLugar
                })
                .ToListAsync();

            var ranking = postsComLocal
                .GroupBy(p => p.Localizacao, StringComparer.OrdinalIgnoreCase)
                .Select(g => new
                {
                    destino = g.First().Localizacao,
                    totalCurtidas = g.Sum(x => x.CurtidasPositivas),
                    mediaAvaliacao = g.Any(x => x.Avaliacao.HasValue)
                        ? Math.Round(g.Where(x => x.Avaliacao.HasValue).Average(x => x.Avaliacao!.Value), 1)
                        : 0m,
                    totalRelatos = g.Count()
                })
                .OrderByDescending(x => x.totalCurtidas)
                .ThenByDescending(x => x.mediaAvaliacao)
                .Take(6)
                .ToList();

            return Ok(ranking);
        }

        // GET: api/Posts/estatisticas-usuario/5
        [HttpGet("estatisticas-usuario/{usuarioId:int}")]
        [SwaggerOperation(Summary = "Engajamento (curtidas e comentários) das publicações de um usuário")]
        public async Task<IActionResult> GetEstatisticasUsuario(int usuarioId)
        {
            var postsUsuario = await _context.posts
                .AsNoTracking()
                .Where(p => p.UsuariosIdUsuario == usuarioId && p.Status == "Ativo")
                .OrderByDescending(p => p.DataCriacao)
                .Select(p => new
                {
                    rotulo = !string.IsNullOrWhiteSpace(p.Localizacao)
                        ? p.Localizacao!.Trim()
                        : (p.Titulo ?? $"Post #{p.IdPost}"),
                    titulo = p.Titulo ?? $"Post #{p.IdPost}",
                    curtidas = p.Curtidas.Count(c => c.Valor == 1),
                    comentarios = p.Comentarios.Count
                })
                .Take(6)
                .ToListAsync();

            return Ok(postsUsuario);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await Route_Books_api.Services.PostQueries.Publicos(_context, UsuarioAtual).FirstOrDefaultAsync(p => p.IdPost == id);
            return post == null ? NotFound(new { mensagem = "Post não encontrado." }) : Ok(post);
        }

        [Authorize]
        [HttpPost]
        [SwaggerOperation(Summary = "Criar postagem ou rascunho com mídia, local e avaliação")]
        [RequestSizeLimit(55_000_000)]
        public async Task<IActionResult> CreatePost(
            [FromForm][Bind("Titulo,Resumo,Conteudo,TiposIdTipo,CategoriasIdCategoria,Localizacao,AvaliacaoLugar")] Post post,
            IFormFile? fotoPost,
            [FromForm] List<IFormFile>? fotosPost,
            [FromForm] string? acao)
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(claim, out var usuarioId))
                return Unauthorized(new { mensagem = "Entre na sua conta para publicar." });

            acao ??= "publicar";
            if (acao != "publicar" && acao != "rascunho")
                return BadRequest(new { mensagem = "Ação de publicação inválida." });

            post.Titulo = post.Titulo?.Trim();
            post.Conteudo = post.Conteudo?.Trim();
            post.Resumo = post.Resumo?.Trim();
            post.Localizacao = string.IsNullOrWhiteSpace(post.Localizacao) ? null : post.Localizacao.Trim();
            if (acao == "publicar" && (string.IsNullOrWhiteSpace(post.Titulo) || string.IsNullOrWhiteSpace(post.Conteudo)))
                return BadRequest(new { mensagem = "Preencha o título e o relato da viagem." });
            if (post.Localizacao?.Length > 180)
                return BadRequest(new { mensagem = "O local pode ter até 180 caracteres." });
            if (post.AvaliacaoLugar is < 1 or > 5)
                return BadRequest(new { mensagem = "A avaliação deve ser entre 1 e 5 estrelas." });
            if (acao == "publicar" && (post.CategoriasIdCategoria is null or <= 0 || post.TiposIdTipo is null or <= 0))
                return BadRequest(new { mensagem = "Selecione o tipo de viagem e a categoria." });
            if (post.CategoriasIdCategoria.HasValue && !await _context.categorias.AnyAsync(c => c.Id == post.CategoriasIdCategoria))
                return BadRequest(new { mensagem = "A categoria selecionada não existe." });
            if (post.TiposIdTipo.HasValue && !await _context.tipo.AnyAsync(t => t.IdTipo == post.TiposIdTipo))
                return BadRequest(new { mensagem = "O tipo de viagem selecionado não existe." });

            var arquivos = fotosPost?.ToList() ?? new List<IFormFile>();
            if (fotoPost != null) arquivos.Insert(0, fotoPost);
            if (arquivos.Count > 10) return BadRequest(new { mensagem = "Envie até 10 fotos por publicação." });
            var formatos = new Dictionary<string, string[]>
            {
                ["image/jpeg"] = new[] { ".jpg", ".jpeg" },
                ["image/png"] = new[] { ".png" },
                ["image/webp"] = new[] { ".webp" },
                ["video/mp4"] = new[] { ".mp4" },
                ["video/webm"] = new[] { ".webm" },
                ["video/quicktime"] = new[] { ".mov" }
            };
            foreach (var arquivo in arquivos)
            {
                var mime = arquivo.ContentType.ToLowerInvariant(); var extensao = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
                if (!formatos.TryGetValue(mime, out var extensoes) || !extensoes.Contains(extensao) || arquivo.Length == 0)
                    return BadRequest(new { mensagem = "Envie fotos JPG, PNG, WEBP ou um vídeo MP4, WEBM ou MOV." });
                var video = mime.StartsWith("video/");
                if (video && arquivos.Count > 1) return BadRequest(new { mensagem = "Envie um vídeo ou um álbum de fotos por vez." });
                if (arquivo.Length > (video ? 20L : 5L) * 1024 * 1024) return BadRequest(new { mensagem = "Cada foto pode ter até 5 MB; o vídeo, até 20 MB." });
            }
            var salvos = new List<string>(); var urls = new List<string>();
            try
            {
                if (arquivos.Count > 0)
                {
                    var pasta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imgs", "posts-usuarios"); Directory.CreateDirectory(pasta);
                    foreach (var arquivo in arquivos)
                    {
                        var nome = Guid.NewGuid().ToString("N") + Path.GetExtension(arquivo.FileName).ToLowerInvariant();
                        var caminho = Path.Combine(pasta, nome); salvos.Add(caminho);
                        await using (var stream = System.IO.File.Create(caminho)) await arquivo.CopyToAsync(stream, HttpContext.RequestAborted);
                        urls.Add("/imgs/posts-usuarios/" + nome);
                    }
                    post.ImagemUrl = urls[0]; post.TipoMidia = arquivos[0].ContentType.StartsWith("video/") ? "video" : "imagem";
                    if (post.TipoMidia != "video") post.ImagensJson = System.Text.Json.JsonSerializer.Serialize(urls);
                }

                post.UsuariosIdUsuario = usuarioId;

                if (acao == "rascunho")
                {
                    post.Status = "Rascunho";
                }
                else
                {
                    post.Status = User.IsInRole("Admin") ? "Ativo" : "Pendente";
                }

                post.DataCriacao = DateTime.UtcNow;
                _context.posts.Add(post);
                await _context.SaveChangesAsync();
            }
            catch
            {
                foreach (var caminho in salvos) if (System.IO.File.Exists(caminho)) System.IO.File.Delete(caminho);

                throw;
            }

            return Ok(new
            {
                mensagem = acao == "rascunho" ? "Rascunho salvo com sucesso!" : "Postagem criada com sucesso!",
                post
            });
        }

        // PUT: api/Posts/5
        [Authorize]
        [HttpPut("{id:int}")]
        [SwaggerOperation(Summary = "Atualizar post", Description = "Atualiza os dados de um post pertencente ao usuário autenticado.")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] AtualizarPostRequest req)
        {
            var usuarioId = UsuarioAtual;
            if (usuarioId <= 0)
                return Unauthorized(new { mensagem = "Entre na sua conta para editar." });

            if (req.IdPost != 0 && id != req.IdPost)
                return BadRequest(new { mensagem = "O ID da URL não confere com o ID do post." });

            var existente = await _context.posts.FindAsync(id);
            if (existente == null)
                return NotFound(new { mensagem = "Post não encontrado para atualização." });

            if (existente.UsuariosIdUsuario != usuarioId && !User.IsInRole("Admin"))
                return StatusCode(403, new { mensagem = "Você só pode editar as suas próprias publicações." });

            var titulo = req.Titulo?.Trim();
            var conteudo = req.Conteudo?.Trim();
            var resumo = string.IsNullOrWhiteSpace(req.Resumo) ? null : req.Resumo.Trim();
            var localizacao = string.IsNullOrWhiteSpace(req.Localizacao) ? null : req.Localizacao.Trim();

            if (string.IsNullOrWhiteSpace(titulo) || string.IsNullOrWhiteSpace(conteudo))
                return BadRequest(new { mensagem = "Preencha o título e o relato da viagem." });

            if (localizacao?.Length > 180)
                return BadRequest(new { mensagem = "O local pode ter até 180 caracteres." });

            if (req.AvaliacaoLugar.HasValue && (req.AvaliacaoLugar.Value < 1 || req.AvaliacaoLugar.Value > 5))
                return BadRequest(new { mensagem = "A avaliação deve ser entre 1 e 5 estrelas." });

            if (req.CategoriasIdCategoria.HasValue && req.CategoriasIdCategoria.Value > 0 &&
                !await _context.categorias.AnyAsync(c => c.Id == req.CategoriasIdCategoria.Value))
                return BadRequest(new { mensagem = "A categoria selecionada não existe." });

            if (req.TiposIdTipo.HasValue && req.TiposIdTipo.Value > 0 &&
                !await _context.tipo.AnyAsync(t => t.IdTipo == req.TiposIdTipo.Value))
                return BadRequest(new { mensagem = "O tipo de viagem selecionado não existe." });

            existente.Titulo = titulo;
            existente.Resumo = resumo;
            existente.Conteudo = conteudo;
            existente.Localizacao = localizacao;
            existente.AvaliacaoLugar = req.AvaliacaoLugar;

            if (req.CategoriasIdCategoria.HasValue && req.CategoriasIdCategoria.Value > 0)
                existente.CategoriasIdCategoria = req.CategoriasIdCategoria.Value;

            if (req.TiposIdTipo.HasValue && req.TiposIdTipo.Value > 0)
                existente.TiposIdTipo = req.TiposIdTipo.Value;

            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Post atualizado com sucesso!", post = existente });
        }

        // DELETE: api/Posts/5
        [Authorize]
        [HttpDelete("{id:int}")]
        [SwaggerOperation(Summary = "Excluir post", Description = "Remove um post pertencente ao usuário autenticado e apaga a mídia associada se existir.")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var usuarioId = UsuarioAtual;
            if (usuarioId <= 0)
                return Unauthorized(new { mensagem = "Entre na sua conta para excluir." });

            var post = await _context.posts.FindAsync(id);
            if (post == null)
                return NotFound(new { mensagem = "Post não encontrado." });

            if (post.UsuariosIdUsuario != usuarioId && !User.IsInRole("Admin"))
                return StatusCode(403, new { mensagem = "Você só pode excluir as suas próprias publicações." });

            var midias = string.IsNullOrEmpty(post.ImagensJson)
                ? Array.Empty<string>()
                : System.Text.Json.JsonSerializer.Deserialize<string[]>(post.ImagensJson) ?? Array.Empty<string>();

            foreach (var url in midias.Append(post.ImagemUrl ?? "").Distinct())
            {
                if (!url.StartsWith("/imgs/posts-usuarios/")) continue;
                var caminho = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imgs", "posts-usuarios", Path.GetFileName(url));
                if (System.IO.File.Exists(caminho)) System.IO.File.Delete(caminho);
            }

            _context.posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Post excluído com sucesso!" });
        }

        [HttpGet("create")]
        [Authorize]
        public async Task<IActionResult> CreateData()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int? usuarioLogadoId = null;
            if (int.TryParse(userIdClaim, out var parsedId))
            {
                usuarioLogadoId = parsedId;
            }

            Post? rascunho = null;

            if (usuarioLogadoId != null)
            {
                rascunho = await _context.posts
                    .FirstOrDefaultAsync(p =>
                        p.UsuariosIdUsuario == usuarioLogadoId.Value &&
                        p.Status == "Rascunho");
            }

            var categorias = await _context.categorias
                .Select(c => new { id = c.Id, nome = c.Nome })
                .ToListAsync();

            var tipos = await _context.Set<Tipo>()
                .Select(t => new { id = t.IdTipo, nome = t.nomeTipo })
                .ToListAsync();

            return Ok(new
            {
                rascunho = rascunho,
                categorias = categorias,
                tipos = tipos
            });
        }

        // GET: api/Posts/pendentes
        [HttpGet("pendentes")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Listar posts pendentes", Description = "Retorna todos os posts que estão aguardando aprovação.")]
        public async Task<IActionResult> GetPostsPendentes()
        {
            var postsPendentes = await _context.posts
                .Where(p => p.Status == "PENDENTE")
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();

            return Ok(postsPendentes);
        }

        // PATCH: api/Posts/5/aprovar
        [HttpPatch("{id:int}/aprovar")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Aprovar post", Description = "Muda o status de um post pendente para Ativo, liberando-o no feed.")]
        public async Task<IActionResult> AprovarPost(int id)
        {
            var post = await _context.posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { mensagem = "Post não encontrado." });
            }

            if (post.Status != "PENDENTE")
            {
                return BadRequest(new { mensagem = "Este post não está pendente de moderação." });
            }

            post.Status = "Ativo";
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Post aprovado e publicado com sucesso no feed!", post });
        }
    }
}