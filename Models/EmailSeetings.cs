namespace PI_RouteBooks.Models
{
    public class EmailSettings
    {
        public string Email { get; set; } = "";
        public string Senha { get; set; } = "";
        public string Smtp { get; set; } = "";
        public int Porta { get; set; }
    }
}