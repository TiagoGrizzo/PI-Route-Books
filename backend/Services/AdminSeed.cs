using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
using Route_Books_api.Models;

namespace Route_Books_api.Services
{
    public static class AdminSeed
    {
        public static async Task Executar(ApplicationDbContext db, IConfiguration configuration)
        {
            var email = configuration["AdminSeed:Email"]?.Trim();
            var senha = configuration["AdminSeed:Password"];
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(senha) || senha.Length < 12)
                throw new InvalidOperationException("Configure AdminSeed:Email e AdminSeed:Password (mínimo de 12 caracteres) antes de executar --seed-admin.");

            var usuario = await db.usuarios.FirstOrDefaultAsync(u => u.Email == email);
            if (usuario == null)
            {
                usuario = new Usuario
                {
                    Username = "admin",
                    NomeCompleto = "Administrador Route Books",
                    Email = email,
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword(senha),
                    Role = "Admin",
                    CriadoEm = DateTime.Now,
                    AlteradoEm = DateTime.Now
                };
                db.usuarios.Add(usuario);
            }
            else
            {
                usuario.Role = "Admin";
                usuario.AlteradoEm = DateTime.Now;
            }

            await db.SaveChangesAsync();
            Console.WriteLine($"[Seed] Administrador inicial pronto: {email}");
        }
    }
}
