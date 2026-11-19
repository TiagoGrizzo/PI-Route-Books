using Microsoft.EntityFrameworkCore;
using Route_Books_api.Models;
using System.Security.Cryptography;
namespace Route_Books_api.Data;

// Dando início às comunidades e aos perfis fictícios para testar o feed.
public static class DemoSeed
{
    public static async Task Executar(ApplicationDbContext db)
    {
        await using var tx = await db.Database.BeginTransactionAsync();
        var comunidades = new[] {
   ("mochileiros-do-mundo", "Mochileiros do Mundo", "🌎", "Troque relatos, ideias de roteiro e descobertas de cada viagem."),
   ("amantes-da-natureza", "Amantes da Natureza", "🌲", "Trilhas, montanhas e viagens para desacelerar ao ar livre."),
   ("gastronomia-pelo-mundo", "Gastronomia pelo Mundo", "🍴", "Sabores, mercados e histórias que começam à mesa."),
   ("parques-e-magia", "Parques e Magia", "🏰", "Dicas para aproveitar parques temáticos e viagens em família."),
   ("viagens-de-aventura", "Viagens de Aventura", "🧭", "Um encontro para quem gosta de caminhar e conhecer novos caminhos."),
   ("dicas-e-economia", "Dicas e Economia", "🎒", "Planejamento, bagagem e ideias para viajar com mais tranquilidade.")
  };
        var groups = new List<Comunidade>();
        foreach (var (slug, nome, icone, descricao) in comunidades)
        {
            var c = await db.comunidades.SingleOrDefaultAsync(c => c.Slug == slug);
            if (c == null) { c = new Comunidade { Slug = slug, Nome = nome, Icone = icone, Descricao = descricao }; db.comunidades.Add(c); }
            groups.Add(c);
        }
        var people = new[] {
   ("clara_monteiro","Clara Monteiro","Florianópolis","SC"),
   ("rafael_andrade","Rafael Andrade","Curitiba","PR"),
   ("marina_costa","Marina Costa","São Paulo","SP"),
   ("pedro_lima","Pedro Lima","Belo Horizonte","MG"),
   ("beatriz_rocha","Beatriz Rocha","Recife","PE"),
   ("lucas_almeida","Lucas Almeida","Porto Alegre","RS")
  };
        var users = new List<Usuario>();
        foreach (var (slug, nome, cidade, uf) in people)
        {
            var username = "demo_" + slug;
            var u = await db.usuarios.SingleOrDefaultAsync(u => u.Username == username);
            if (u == null)
            {
                u = new Usuario
                {
                    Username = username,
                    NomeCompleto = nome,
                    Email = username + "@example.test",
                    EstadoConta = "Ativo",
                    Cidade = cidade,
                    Uf = uf,
                    Pais = "Brasil",
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword(Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))),
                    FotoPerfil = Route_Books_api.Services.AvataresPadrao.Sortear(),
                    Biografia = "Perfil fictício de demonstração. Apaixonado por viagens, paisagens e novas histórias."
                };
                db.usuarios.Add(u);
            }
            users.Add(u);
        }
        await db.SaveChangesAsync();
        var category = await db.categorias.OrderBy(c => c.Id).FirstOrDefaultAsync();
        if (category == null) { category = new Categoria { Nome = "Relatos de viagem" }; db.categorias.Add(category); }
        var type = await db.tipo.OrderBy(t => t.IdTipo).FirstOrDefaultAsync();
        if (type == null) { type = new Tipo { nomeTipo = "Postagem Padrão", Descricao = "Relatos da comunidade" }; db.tipo.Add(type); }
        await db.SaveChangesAsync();
        var samples = new[] {
   ("Torres del Paine: uma pausa diante das montanhas", "O azul da lagoa e as torres de pedra são o cenário deste roteiro de inspiração.", "Um dia para caminhar com calma, observar a paisagem e registrar os detalhes do caminho. A proposta deste roteiro é separar tempo para descansar e aproveitar os mirantes, sem transformar a viagem numa corrida.", "Torres del Paine, Chile", "torres-del-paine.jpg", "https://www.shutterstock.com/image-photo/torres-del-paine-national-park-chilean-2579351219",0,1),
   ("Fitz Roy no horizonte", "Montanhas, céu aberto e uma vontade enorme de continuar explorando a Patagônia.", "A ideia desta aventura é montar uma base em El Chaltén e escolher os passeios de acordo com o clima e a disposição do grupo. Um caderno, uma câmera e boas conversas completam a viagem.", "El Chaltén, Argentina", "fitz-roy.jpg", "https://www.shutterstock.com/image-photo/mount-fitz-roy-los-glaciares-national-2433096031",1,4),
   ("Perito Moreno: encontro com o gelo", "Uma paisagem de tons azuis para entrar na lista de lugares que queremos conhecer.", "Neste relato de exemplo, a viagem passa por El Calafate e pelas vistas do glaciar. A sugestão é reservar tempo para contemplar a paisagem e fotografar de diferentes ângulos.", "Perito Moreno, Argentina", "perito-moreno.jpg", "https://www.shutterstock.com/image-photo/cover-page-big-perito-moreno-glacier-2338026345",2,0),
   ("Sabores que também contam histórias", "Mercados, cafés e pratos locais merecem um espaço no diário de bordo.", "Meu roteiro de inspiração tem uma regra simples: deixar uma tarde livre para descobrir a gastronomia local. Qual foi o sabor mais marcante de uma viagem sua?", "Belo Horizonte, Brasil", "", "",3,2),
   ("Um dia de parque sem pressa", "Entre uma atração e outra, também vale parar para aproveitar o momento.", "Este planejamento de exemplo alterna atrações, pausas e refeições. A ideia é construir um dia agradável para todo o grupo, respeitando o ritmo de cada pessoa.", "Orlando, Estados Unidos", "", "",4,3),
   ("O que levo numa mochila de fim de semana", "Uma lista enxuta deixa mais espaço para as lembranças da viagem.", "Para este roteiro curto, separei roupas que combinam entre si, um caderno, uma garrafa reutilizável e os documentos. Antes de fechar a mochila, sempre confiro o clima do destino e o tempo de deslocamento.", "Porto Alegre, Brasil", "", "",5,5)
  };
        var posts = new List<Post>();
        foreach (var (titulo, resumo, conteudo, local, imagem, fonte, autor, grupo) in samples)
        {
            var uid = users[autor].IdUsuario;
            var p = await db.posts.SingleOrDefaultAsync(p => p.UsuariosIdUsuario == uid && p.Titulo == titulo);
            if (p == null) { p = new Post { Titulo = titulo, Resumo = resumo, Conteudo = conteudo + "\n\nRelato fictício de demonstração; imagem ilustrativa quando disponível.", Status = "Ativo", DataCriacao = DateTime.UtcNow.AddHours(-posts.Count * 3), UsuariosIdUsuario = uid, ComunidadeId = groups[grupo].Id, Localizacao = local, CategoriasIdCategoria = category.Id, TiposIdTipo = type.IdTipo, ImagemUrl = imagem == "" ? null : "/imgs/demo/" + imagem, TipoMidia = imagem == "" ? null : "image", ImagemFonteUrl = fonte == "" ? null : fonte }; db.posts.Add(p); }
            posts.Add(p);
        }
        await db.SaveChangesAsync();
        for (var i = 0; i < users.Count; i++)
        {
            var uid = users[i].IdUsuario;
            foreach (var group in new[] { groups[i], groups[(i + 1) % groups.Count] })
                if (!await db.comunidadeMembros.AnyAsync(m => m.ComunidadeId == group.Id && m.UsuarioId == uid)) db.comunidadeMembros.Add(new ComunidadeMembro { ComunidadeId = group.Id, UsuarioId = uid });
            var following = users[(i + 1) % users.Count].IdUsuario;
            if (!await db.seguidores.AnyAsync(s => s.IdUsuarioSeguidor == uid && s.IdUsuarioSeguido == following)) db.seguidores.Add(new Seguidor { IdUsuarioSeguidor = uid, IdUsuarioSeguido = following });
            var post = posts[(i + 1) % posts.Count];
            if (!await db.curtidas.AnyAsync(v => v.PostId == post.IdPost && v.UsuarioId == uid)) db.curtidas.Add(new Curtida { PostId = post.IdPost, UsuarioId = uid, Valor = 1, AlteradoEm = DateTime.UtcNow });
        }
        await db.SaveChangesAsync();
        await tx.CommitAsync();
        Console.WriteLine("[Demonstração] 6 perfis, 6 comunidades e 6 relatos prontos. Dados existentes preservados.");
    }
}
