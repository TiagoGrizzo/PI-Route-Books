using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Models;
using System.Security.Cryptography;
namespace Route_Books_api.Services;

public static class PerfilOficialSeed
{
    public static async Task<int> Executar(ApplicationDbContext db)
    {
        var usuario = await db.usuarios.SingleOrDefaultAsync(u => u.Username == "routebooks");
        if (usuario != null && !usuario.PerfilOficial)
            throw new InvalidOperationException("O username routebooks já pertence a outro perfil. Nenhuma conta foi convertida.");
        if (usuario == null)
        {
            usuario = new Usuario
            {
                Username = "routebooks",
                NomeCompleto = "Route Books",
                PerfilOficial = true,
                Email = "routebooks-official@example.test",
                EstadoConta = "Ativo",
                Pais = "Brasil",
                Biografia = "Perfil oficial do Route Books. Conectamos viajantes, compartilhamos novidades e inspiramos novas histórias. Sua próxima aventura começa aqui!",
                FotoPerfil = "/imgs/perfis/routebooks-oficial.png",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)))
            };
            db.usuarios.Add(usuario);
            await db.SaveChangesAsync();
        }
        Console.WriteLine($"[Route Books] Perfil oficial pronto: /perfil/{usuario.IdUsuario} (@routebooks).");
        return usuario.IdUsuario;
    }
}
