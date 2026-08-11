using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PI_RouteBooks.Models.ViewModel
{
    public class PerfilViewModel
    {
        // 1. Informações do Usuário que vão aparecer na tela
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DataCadastro { get; set; }

        // 2. A lista de posts que pertence a esse usuário
        // (Troque "Post" pelo nome exato da sua classe/Model de Postagens)
        public List<Post> MeusPosts { get; set; } = new List<Post>();
    }
}
