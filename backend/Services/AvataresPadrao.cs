using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Route_Books_api.Data;
namespace Route_Books_api.Services;

// Escolhendo um avatar somente até a pessoa enviar sua própria foto.
public static class AvataresPadrao {
 public static readonly string[] Caminhos = new[] { "montanhas", "floresta", "castelo", "bussola", "aviao", "estrada", "bagagem", "globo" }.Select(nome => "/imgs/avatares-padrao/" + nome + ".svg").ToArray();
 public static string Sortear() => Caminhos[RandomNumberGenerator.GetInt32(Caminhos.Length)];
 public static async Task PreencherExistentes(ApplicationDbContext db) {
  var antigos = new[] {"clara_monteiro","rafael_andrade","marina_costa","pedro_lima","beatriz_rocha","lucas_almeida"}.Select(nome=>"/imgs/demo/"+nome+".svg").ToArray();
  var pessoas = await db.usuarios.Where(u=>u.DeletadoEm==null && (u.FotoPerfil==null || u.FotoPerfil.Trim()=="" || antigos.Contains(u.FotoPerfil))).OrderBy(u=>u.IdUsuario).ToListAsync();
  var opcoes = Caminhos.ToArray();RandomNumberGenerator.Shuffle(opcoes.AsSpan());
  for(var i=0;i<pessoas.Count;i++) pessoas[i].FotoPerfil=opcoes[i%opcoes.Length];
  if(pessoas.Count>0)await db.SaveChangesAsync();
  Console.WriteLine($"[Perfis] {pessoas.Count} avatares padrão atribuídos; fotos pessoais preservadas.");
 }
}
