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

        // GET: api/Posts
        [HttpGet]
        [SwaggerOperation(Summary = "Listar posts ativos", Description = "Retorna os posts mais recentes com status ativo, permitindo busca opcional.")]
        public async Task<IActionResult> GetPosts([FromQuery] string? busca)
        {
            try
            {
                var postsQuery = _context.posts
                    .Where(p => p.Status == "Ativo")
                    .Include(p => p.Autor)
                    .Include(p => p.CategoriaRef)
                    .Include(p => p.TipoRef)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(busca))
                {
                    string termo = busca.Trim().ToLower();

                    postsQuery = postsQuery.Where(p =>
                        p.Titulo.ToLower().Contains(termo) ||
                        (p.Resumo != null && p.Resumo.ToLower().Contains(termo))
                    );
                }

                var posts = await postsQuery
                    .OrderByDescending(p => p.DataCriacao)
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                // Imprime o erro detalhado no console do Visual Studio / Terminal do .NET
                Console.WriteLine($"ERRO NO GETPOSTS: {ex.Message} --- Inner: {ex.InnerException?.Message}");
                return StatusCode(500, new { mensagem = "Erro interno no servidor", detalhes = ex.Message });
            }
        }

        // GET: api/Posts/5
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Obter post por ID", Description = "Retorna os detalhes de um post específico pelo ID.")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _context.posts
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .FirstOrDefaultAsync(m => m.IdPost == id);

            if (post == null)
            {
                return NotFound(new { mensagem = "Post não encontrado." });
            }

            return Ok(post);
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Criar ou salvar rascunho de post", Description = "Cria uma postagem ou rascunho com suporte a upload de imagem.")]
        public async Task<IActionResult> CreatePost(
    [FromForm][Bind("Titulo,Resumo,Conteudo,TiposIdTipo,CategoriasIdCategoria")] Post post,
    IFormFile? fotoPost,
    [FromForm] string? acao)
        {
            // Pega o ID do usuário logado via token JWT
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var usuarioLogadoId))
            {
                return Unauthorized(new { mensagem = "Você precisa estar logado para criar ou salvar um post." });
            }

            // Atribui manualmente o que vem por segurança/lógica de negócio
            post.UsuariosIdUsuario = usuarioLogadoId;
            acao = acao ?? "publicar";

            // Resto do seu código continua igualzinho...
            if (acao != "rascunho")
            {
                if (post.CategoriasIdCategoria == null || post.CategoriasIdCategoria == 0)
                {
                    return BadRequest(new { mensagem = "A categoria da viagem é obrigatória." });
                }

                if (post.TiposIdTipo == null || post.TiposIdTipo == 0)
                {
                    return BadRequest(new { mensagem = "O tipo de viagem é obrigatório." });
                }
            }

            // Processamento de imagem, status, etc...
            if (fotoPost != null && fotoPost.Length > 0)
            {
                string pastaImagens = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imgs", "posts-usuarios");
                if (!Directory.Exists(pastaImagens))
                {
                    Directory.CreateDirectory(pastaImagens);
                }

                string nomeUnicoArquivo = Guid.NewGuid().ToString() + "_" + Path.GetFileName(fotoPost.FileName);
                string caminhoCompleto = Path.Combine(pastaImagens, nomeUnicoArquivo);

                using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
                {
                    await fotoPost.CopyToAsync(stream);
                }

                post.ImagemUrl = "/imgs/posts-usuarios/" + nomeUnicoArquivo;
            }

            post.Status = acao == "rascunho" ? "Rascunho" : "Ativo";
            post.DataCriacao = DateTime.Now;

            _context.posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = acao == "rascunho" ? "Rascunho salvo com sucesso!" : "Postagem criada com sucesso!",
                post
            });
        }

        // PUT: api/Posts/5
        [HttpPut("{id}")]
        [SwaggerOperation(Summary = "Atualizar post", Description = "Atualiza os dados de um post existente.")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post post)
        {
            if (id != post.IdPost)
            {
                return BadRequest(new { mensagem = "O ID da URL não confere com o ID do objeto." });
            }

            _context.Entry(post).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
                {
                    return NotFound(new { mensagem = "Post não encontrado para atualização." });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { mensagem = "Post atualizado com sucesso!", post });
        }

        // DELETE: api/Posts/5
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Excluir post", Description = "Remove um post do sistema e apaga a imagem associada se existir.")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { mensagem = "Post não encontrado." });
            }

            if (!string.IsNullOrEmpty(post.ImagemUrl))
            {
                var caminhoArquivoFisico = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImagemUrl.TrimStart('/'));
                if (System.IO.File.Exists(caminhoArquivoFisico))
                {
                    System.IO.File.Delete(caminhoArquivoFisico);
                }
            }

            _context.posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Post excluído com sucesso!" });
        }
        [HttpGet("create")]
        [Authorize]
        public async Task<IActionResult> CreateData()
        {
            // Tenta pegar o ID do usuário logado via Claims (caso o [Authorize] já valide o Cookie do JWT)
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
        private bool PostExists(int id)
        {
            return _context.posts.Any(e => e.IdPost == id);
        }
    }
}
