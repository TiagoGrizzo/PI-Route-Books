using System;
using System.Collections.Generic;
using System.IO; // Adicionado para lidar com manipulação de arquivos
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http; // Adicionado para receber o IFormFile da foto
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using PI_RouteBooks.Data;
using PI_RouteBooks.Models;

namespace PI_RouteBooks.Controllers
{
    public class PostsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Posts
        public async Task<IActionResult> Index()
        {
            // Ordenando pelos posts mais recentes para o feed ficar dinâmico
            var applicationDbContext = _context.posts
                .Where(p => p.Status == "Ativo") // Serve para filtrar quais posts são ativos ou rascunhos 
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .OrderByDescending(p => p.DataCriacao)
                .Take(3);

            return View(await applicationDbContext.ToListAsync());
        }

        [HttpGet]
        public async Task<IActionResult> VerPosts(string busca) // MUDANÇA NO VERPOST() PARA A BARRA DE PESQUISA DIRECIONAR A GENTE PARA LÁ E VERMOS OS RESULTADOS 
        {
            // Passa o termo pesquisado para a View (para preencher o input e mostrar a mensagem)
            ViewBag.Busca = busca;

            // Começamos criando a query base (IQueryable - ainda não foi no banco)
            var postsQuery = _context.posts
                .Where(p => p.Status == "Ativo")
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .AsQueryable();

            // Se o usuário digitou algo na busca, aplicamos o filtro
            if (!string.IsNullOrWhiteSpace(busca))
            {
                // Converte tudo para minúsculo para garantir a busca sem case-sensitive
                string termo = busca.Trim().ToLower();

                postsQuery = postsQuery.Where(p =>
                    p.Titulo.ToLower().Contains(termo) ||
                    (p.Resumo != null && p.Resumo.ToLower().Contains(termo))
                );
            }

            // Aplica a ordenação e executa a busca no banco de dados de forma assíncrona
            var posts = await postsQuery
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();

            return View(posts);
        }

        // GET: Posts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var post = await _context.posts
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .FirstOrDefaultAsync(m => m.IdPost == id);
            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // GET: Posts/Create - mudei aqui !!!!
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var usuarioLogado = HttpContext.Session.GetInt32("UsuarioId");

            Post? rascunho = null;

            if (usuarioLogado != null)
            {
                rascunho = await _context.posts
                    .FirstOrDefaultAsync(p =>
                        p.UsuariosIdUsuario == usuarioLogado.Value &&
                        p.Status == "Rascunho");
            }

            ViewBag.CategoriasIdCategoria = new SelectList(
                _context.categorias,
                "Id",
                "Nome",
                rascunho?.CategoriasIdCategoria
            );

            ViewBag.TiposIdTipo = new SelectList(
                _context.Set<Tipo>(),
                "IdTipo",
                "nomeTipo",
                rascunho?.TiposIdTipo
            );

            return View(rascunho);
        }

        // POST: Posts/Create - MUDEI AQUI !!!!!
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IdPost,Titulo,Resumo,Conteudo,TiposIdTipo,CategoriasIdCategoria")] Post post, IFormFile? fotoPost, string acao)
        {
            // Verifica se existe um usuário logado
            var usuarioLogado = HttpContext.Session.GetInt32("UsuarioId");

            // Se não estiver logado e tentou salvar rascunho
            if (acao == "rascunho" && usuarioLogado == null)
            {
                TempData["MensagemAviso"] =
                    "Faça login ou cadastre-se para continuar essa aventura!";

                return RedirectToAction(nameof(Create));
            }

            // Se estiver logado, associa o post ao usuário logado
            if (usuarioLogado != null)
            {
                post.UsuariosIdUsuario = usuarioLogado.Value;
            }


            // ==========================================
            // SALVAR RASCUNHO
            // ==========================================

            if (acao == "rascunho")
            {
                // Remove validações de propriedades de navegação
                ModelState.Remove("UsuariosIdUsuario");
                ModelState.Remove("Autor");
                ModelState.Remove("CategoriaRef");
                ModelState.Remove("TipoRef");
                ModelState.Remove("ImagemUrl");

                post.Status = "Rascunho";
                post.DataCriacao = DateTime.Now;

                // Busca valores padrão no banco para fallback
                var primeiraCategoria = await _context.categorias.FirstOrDefaultAsync();
                var primeiroTipo = await _context.Set<Tipo>().FirstOrDefaultAsync();

                // Se nenhuma categoria foi selecionada, pega o Id da primeira categoria cadastrada
                if ((post.CategoriasIdCategoria == null || post.CategoriasIdCategoria == 0) && primeiraCategoria != null)
                {
                    post.CategoriasIdCategoria = primeiraCategoria.Id; // Usando .Id correto
                }

                // Se nenhum tipo foi selecionado, pega o IdTipo do primeiro tipo cadastrado
                if ((post.TiposIdTipo == null || post.TiposIdTipo == 0) && primeiroTipo != null)
                {
                    post.TiposIdTipo = primeiroTipo.IdTipo;
                }

                // Se já existir um rascunho desse usuário no banco, atualiza ele.
                var rascunhoExistente = await _context.posts
                    .FirstOrDefaultAsync(p =>
                        p.UsuariosIdUsuario == post.UsuariosIdUsuario &&
                        p.Status == "Rascunho");

                if (rascunhoExistente != null)
                {
                    rascunhoExistente.Titulo = post.Titulo;
                    rascunhoExistente.Resumo = post.Resumo;
                    rascunhoExistente.Conteudo = post.Conteudo;
                    rascunhoExistente.DataCriacao = DateTime.Now;

                    // Atribui a categoria/tipo atualizada ou o fallback padrão se estivesse nulo
                    rascunhoExistente.CategoriasIdCategoria = post.CategoriasIdCategoria ?? primeiraCategoria?.Id;
                    rascunhoExistente.TiposIdTipo = post.TiposIdTipo ?? primeiroTipo?.IdTipo;

                    // Upload da foto para o rascunho existente
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

                        rascunhoExistente.ImagemUrl = "/imgs/posts-usuarios/" + nomeUnicoArquivo;
                    }
                }
                else
                {
                    // Primeiro salvamento do rascunho
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

                    _context.posts.Add(post);
                }

                await _context.SaveChangesAsync();

                TempData["MensagemSucesso"] = "Rascunho salvo com sucesso! Você poderá continuar depois, clique no botão criar post! ";

                return RedirectToAction(nameof(Index));
            }


            // ==========================================
            // PUBLICAR RELATO
            // ==========================================

            post.Status = "Ativo";
            post.DataCriacao = DateTime.Now;

            ModelState.Remove("UsuariosIdUsuario");
            ModelState.Remove("Autor");
            ModelState.Remove("CategoriaRef");
            ModelState.Remove("TipoRef");
            ModelState.Remove("ImagemUrl");

            if (ModelState.IsValid)
            {
                // Upload da imagem
                if (fotoPost != null && fotoPost.Length > 0)
                {
                    string pastaImagens = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        "imgs",
                        "posts-usuarios"
                    );

                    if (!Directory.Exists(pastaImagens))
                    {
                        Directory.CreateDirectory(pastaImagens);
                    }

                    string nomeUnicoArquivo =
                        Guid.NewGuid().ToString() + "_" +
                        Path.GetFileName(fotoPost.FileName);

                    string caminhoCompleto =
                        Path.Combine(pastaImagens, nomeUnicoArquivo);

                    using (var stream = new FileStream(
                        caminhoCompleto,
                        FileMode.Create))
                    {
                        await fotoPost.CopyToAsync(stream);
                    }

                    post.ImagemUrl =
                        "/imgs/posts-usuarios/" + nomeUnicoArquivo;
                }

                // Verifica se existe um rascunho do usuário.
                var rascunhoExistente = await _context.posts
                    .FirstOrDefaultAsync(p =>
                        p.UsuariosIdUsuario == post.UsuariosIdUsuario &&
                        p.Status == "Rascunho");

                if (rascunhoExistente != null)
                {
                    // Transforma o rascunho na postagem publicada.
                    rascunhoExistente.Titulo = post.Titulo;
                    rascunhoExistente.Resumo = post.Resumo;
                    rascunhoExistente.Conteudo = post.Conteudo;
                    rascunhoExistente.TiposIdTipo = post.TiposIdTipo;
                    rascunhoExistente.CategoriasIdCategoria = post.CategoriasIdCategoria;
                    rascunhoExistente.Status = "Ativo";
                    rascunhoExistente.DataCriacao = DateTime.Now;

                    if (!string.IsNullOrEmpty(post.ImagemUrl))
                    {
                        rascunhoExistente.ImagemUrl = post.ImagemUrl;
                    }
                }
                else
                {
                    _context.posts.Add(post);
                }

                await _context.SaveChangesAsync();

                TempData["MensagemSucesso"] =
                    "Postagem criada com sucesso! Confira na página INICIAL ou na COMECE SUA AVENTURA ";

                return RedirectToAction(nameof(Index));
            }

            // ==========================================
            // RETORNA PARA A TELA CASO TENHA ERRO
            // ==========================================

            ViewBag.CategoriasIdCategoria = new SelectList(
                _context.categorias,
                "Id",
                "Nome",
                post.CategoriasIdCategoria
            );

            ViewBag.TiposIdTipo = new SelectList(
                _context.tipo,
                "IdTipo",
                "nomeTipo",
                post.TiposIdTipo
            );

            return View(post);
        }

        // GET: Posts/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var post = await _context.posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }
            ViewBag.CategoriasIdCategoria = new SelectList(_context.categorias, "Id", "Nome", post.CategoriasIdCategoria);
            ViewBag.TiposIdTipo = new SelectList(_context.Set<Tipo>(), "IdTipo", "IdTipo", post.TiposIdTipo);
            return View(post);
        }

        // POST: Posts/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("IdPost,Titulo,Resumo,Conteudo,TiposIdTipo,CategoriasIdCategoria,UsuariosIdUsuario,DataCriacao,ImagemUrl,Status")] Post post)
        {
            if (id != post.IdPost)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(post);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PostExists(post.IdPost))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(post);
        }

        // GET: Posts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var post = await _context.posts
                .Include(p => p.Autor)
                .Include(p => p.CategoriaRef)
                .Include(p => p.TipoRef)
                .FirstOrDefaultAsync(m => m.IdPost == id);
            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // POST: Posts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var post = await _context.posts.FindAsync(id);
            if (post != null)
            {
                // Código opcional: Se quiser deletar o arquivo físico de imagem do servidor ao apagar o post:
                if (!string.IsNullOrEmpty(post.ImagemUrl))
                {
                    var caminhoArquivoFisico = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImagemUrl.TrimStart('/'));
                    if (System.IO.File.Exists(caminhoArquivoFisico))
                    {
                        System.IO.File.Delete(caminhoArquivoFisico);
                    }
                }

                _context.posts.Remove(post);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PostExists(int id)
        {
            return _context.posts.Any(e => e.IdPost == id);
        }
    }
}
