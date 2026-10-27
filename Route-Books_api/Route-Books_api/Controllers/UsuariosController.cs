using BCrypt.Net; // Biblioteca de criptografia de senhas
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Route_Books_api.Data;
using Route_Books_api.Models;
using Route_Books_api.Services;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace Route_Books_api.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMongoCollection<MensagemChat> _mensagens;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;
        public UsuariosController(ApplicationDbContext context, IMongoClient mongoclient, IConfiguration configuration, EmailService emailService)
        {
            _context = context;

            var database = mongoclient.GetDatabase("RouteBooksChat");
            _mensagens = database.GetCollection<MensagemChat>("Mensagens");
            _configuration = configuration;
            _emailService = emailService;
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Dictionary<string, string> dados)
        {
            // Tenta pegar o email e a senha do dicionário enviado pelo front
            if (!dados.TryGetValue("email", out var email) || !dados.TryGetValue("senhaHash", out var senha) ||
                string.IsNullOrEmpty(email) || string.IsNullOrEmpty(senha))
            {
                return BadRequest(new { mensagem = "E-mail e senha são obrigatórios." });
            }

            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(u => u.Email == email);

            if (usuario != null && BCrypt.Net.BCrypt.Verify(senha, usuario.SenhaHash))
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var secretKey = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);

                var claims = new[]
                {
            new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email),
            new Claim(ClaimTypes.Name, usuario.Username ?? usuario.NomeCompleto ?? "")
        };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddHours(8),
                    Issuer = jwtSettings["Issuer"],
                    Audience = jwtSettings["Audience"],
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                // Armazena o token JWT em um Cookie HTTP-only seguro
                Response.Cookies.Append("auth_token", tokenString, new CookieOptions
                {
                    HttpOnly = true,                                  // Inacessível via JavaScript (Proteção contra XSS)
                    Secure = false,                                   // Defina como 'true' em produção (HTTPS). Como localmente costuma ser HTTP, deixamos 'false' para testes funcionarem.
                    SameSite = SameSiteMode.Lax,                      // 'Lax' ou 'Strict' para proteção contra CSRF
                    Expires = DateTime.UtcNow.AddHours(8)
                });

                // Retorna os dados do usuário (sem expor o token no corpo da resposta)
                return Ok(new
                {
                    mensagem = "Login realizado com sucesso!",
                    usuarioId = usuario.IdUsuario,
                    nome = usuario.NomeCompleto,
                    email = usuario.Email
                });
            }

            return Unauthorized(new { mensagem = "E-mail ou senha incorretos!" });
        }

        // POST: api/Usuarios/esqueceu-senha
        [HttpPost("esqueceu-senha")]
        [SwaggerOperation(
            Summary = "Esqueceu a senha - esqueceu-senha",
            Description = "O usuário esquece a senha."
        )]
        public async Task<IActionResult> EsqueceuSenha([FromBody] Dictionary<string, string> dados)
        {
            if (!dados.TryGetValue("email", out var email) || string.IsNullOrEmpty(email))
            {
                return BadRequest(new { mensagem = "E-mail é obrigatório." });
            }

            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(u => u.Email == email);

            if (usuario == null)
            {
                // Por segurança, muitas APIs retornam OK mesmo se o e-mail não existir 
                // para evitar que descubram quais e-mails estão cadastrados no sistema.
                // Mas se preferir retornar NotFound para teste, pode manter.
                return NotFound(new { mensagem = "Não encontramos uma conta com esse e-mail." });
            }

            // Dispara o e-mail de recuperação de verdade
            await _emailService.EnviarEmailRecuperacaoAsync(usuario.Email, usuario.NomeCompleto, usuario.IdUsuario);

            return Ok(new
            {
                mensagem = "Instruções de recuperação enviadas para o seu e-mail com sucesso!"
            });
        }



        // POST: api/Usuarios/nova-senha
        [HttpPost("nova-senha")]
        [SwaggerOperation(
            Summary = "Trocar a senha - nova-senha",
            Description = "Serve para o usuário trocar sua senha por uma nova."
        )]
        public async Task<IActionResult> NovaSenha([FromBody] Dictionary<string, string> dados)
        {
            // Valida se os campos necessários foram enviados no dicionário
            if (!dados.TryGetValue("idUsuario", out var idUsuarioStr) || string.IsNullOrEmpty(idUsuarioStr) ||
                !dados.TryGetValue("senha", out var senha) || string.IsNullOrEmpty(senha))
            {
                return BadRequest(new { mensagem = "ID do usuário e nova senha são obrigatórios." });
            }

            // Converte o ID para o tipo correto (assumindo que no seu banco seja int ou long)
            if (!int.TryParse(idUsuarioStr, out var idUsuario))
            {
                return BadRequest(new { mensagem = "ID do usuário inválido." });
            }

            // Validações de complexidade da senha
            if (senha.Length < 8 || senha.Length > 30)
            {
                return BadRequest(new { mensagem = "A senha deve ter entre 8 e 30 caracteres." });
            }
            if (!senha.Any(char.IsUpper))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos uma letra maiúscula." });
            }
            if (!senha.Any(char.IsLower))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos uma letra minúscula." });
            }
            if (!senha.Any(char.IsDigit))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos um número." });
            }
            if (!senha.Any(ch => !char.IsLetterOrDigit(ch)))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos um caractere especial." });
            }

            // Busca o usuário no banco MySQL pelo ID
            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(u => u.IdUsuario == idUsuario);

            if (usuario == null)
            {
                return NotFound(new { mensagem = "Usuário não encontrado." });
            }

            // Criptografa a nova senha com BCrypt e atualiza
            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha);

            _context.usuarios.Update(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Senha alterada com sucesso!" });
        }

        // GET: api/Usuarios/5/dashboard-info (Exemplo para carregar dados do Index + Notificações para o React)
        [HttpGet("{id}/dashboard-info")]
        public async Task<IActionResult> GetDashboardInfo(int id)
        {
            var usuario = await _context.usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound(new { mensagem = "Usuário não encontrado." });
            }

            long totalNaoLidas = 0;
            Dictionary<int, int> naoLidasPorRemetente = new Dictionary<int, int>();

            var filtroTotal = Builders<MensagemChat>.Filter.And(
                Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, id),
                Builders<MensagemChat>.Filter.Eq(m => m.Lida, false)
            );

            totalNaoLidas = await _mensagens.CountDocumentsAsync(filtroTotal);
            naoLidasPorRemetente = await ContarMensagensNaoLidasPorRemetente(id);

            return Ok(new
            {
                usuario,
                totalNaoLidas,
                naoLidasPorRemetente
            });
        }

        // GET: api/Usuarios
        [HttpGet]
        [SwaggerOperation(
            Summary = "Obter todos os usuários  - GetAll",
            Description = "Retorna os dados cadastrais detalhados de todos os usuários."
        )]
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _context.usuarios.ToListAsync();
            return Ok(usuarios);
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        [SwaggerOperation(
            Summary = "Obter usuário por ID - Detail",
            Description = "Retorna os dados cadastrais detalhados de um usuário específico com base no ID informado."
        )]
        public async Task<IActionResult> Details(int id)
        {
            var usuario = await _context.usuarios
                .FirstOrDefaultAsync(m => m.IdUsuario == id);

            if (usuario == null)
            {
                return NotFound(new { mensagem = "Usuário não encontrado." });
            }

            return Ok(usuario);
        }

        // POST: api/Usuarios
        
        [HttpPost]
        [SwaggerOperation(
            Summary = "Cadastra um usuário  - Create",
            Description = "cria um usuário no banco de dados."
        )]
        public async Task<IActionResult> Create([FromBody] Usuario usuario)
        {

            //transforma o json enviado pelo frontend para objeto Usuario
            if (usuario == null)
            {
                //BadRequest já devolve statusCode 400
                return BadRequest(new { mensagem = "Dados inválidos." });
            }

            // Valida as regras automáticas da sua Model (como [Required] e [StringLength])
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validação do E-mail (Verifica se já existe no banco MySQL)
            bool emailExiste = await _context.usuarios.AnyAsync(u => u.Email == usuario.Email);
            if (emailExiste)
            {
                return BadRequest(new { mensagem = "Este e-mail já está em uso por outra conta." });
            }

            // Validação robusta da Senha - coloquei, mas podem retirar caso não queiram
            // (O front manda a senha pura na propriedade SenhaHash temporariamente)
            string senha = usuario.SenhaHash ?? "";

            if (senha.Length < 8 || senha.Length > 30)
            {
                return BadRequest(new { mensagem = "A senha deve ter entre 8 e 30 caracteres." });
            }
            if (!senha.Any(char.IsUpper))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos uma letra maiúscula." });
            }
            if (!senha.Any(char.IsLower))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos uma letra minúscula." });
            }
            if (!senha.Any(char.IsDigit))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos um número." });
            }
            if (!senha.Any(ch => !char.IsLetterOrDigit(ch)))
            {
                return BadRequest(new { mensagem = "A senha deve conter pelo menos um caractere especial." });
            }

            // Preenchimento de campos automáticos da Model
            usuario.CriadoEm = DateTime.Now;
            usuario.AlteradoEm = DateTime.Now;
            usuario.EstadoConta = "Ativo";

            // Transforma a senha pura em Hash seguro do BCrypt antes de salvar
            usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha);

            // Salva no banco via Entity Framework
            _context.usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Retorna status 201 (Created) com uma mensagem de sucesso
            return StatusCode(201, new { mensagem = "Usuário cadastrado com sucesso!", id = usuario.IdUsuario });
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        [SwaggerOperation(
            Summary = "Alterar os dados de um usuário por ID - Edit",
            Description = "Altera os dados cadastrais de um determinado usuário."
        )]
        public async Task<IActionResult> Edit(int id, [FromBody] Usuario usuario)
        {
            if (id != usuario.IdUsuario)
            {
                return BadRequest(new { mensagem = "ID do usuário divergente." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                usuario.AlteradoEm = DateTime.Now;
                _context.Update(usuario);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound(new { mensagem = "Usuário não encontrado." });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { mensagem = "Usuário atualizado com sucesso!" });
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        [SwaggerOperation(
            Summary = "Deleta um usuário por ID - Delete",
            Description = "deleta um usuário do banco de dados."
        )]
        public async Task<IActionResult> Delete(int id)
        {
            var usuario = await _context.usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound(new { mensagem = "Usuário não encontrado." });
            }

            _context.usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Usuário excluído com sucesso!" });
        }
        [SwaggerOperation(
            Summary = "private",
            Description = "private."
        )]
        private async Task<Dictionary<int, int>> ContarMensagensNaoLidasPorRemetente(int usuarioId)
        {
            var filtro = Builders<MensagemChat>.Filter.And(
                Builders<MensagemChat>.Filter.Eq(m => m.DestinatarioId, usuarioId),
                Builders<MensagemChat>.Filter.Eq(m => m.Lida, false)
            );

            var mensagens = await _mensagens
                .Find(filtro)
                .ToListAsync();

            return mensagens
                .GroupBy(m => m.RemetenteId)
                .ToDictionary(
                    grupo => grupo.Key,
                    grupo => grupo.Count()
                );
        }
        [SwaggerOperation(
            Summary = "private2",
            Description = "private2."
        )]
        private bool UsuarioExists(int id)
        {
            return _context.usuarios.Any(e => e.IdUsuario == id);
        }
    }
}
