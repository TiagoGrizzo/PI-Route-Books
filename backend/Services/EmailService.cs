using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Route_Books_api.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private (string usuario, string senha, string destino) ObterConfiguracaoEmail()
        {
            var usuario = _configuration["Email:Usuario"]?.Trim();
            var senha = _configuration["Email:Senha"]?.Replace(" ", "").Trim();
            var destino = _configuration["Email:Destino"]?.Trim();

            if (string.IsNullOrWhiteSpace(usuario) || string.IsNullOrWhiteSpace(senha))
                throw new InvalidOperationException("Serviço de e-mail não configurado no servidor (Email:Usuario ou Email:Senha ausentes).");

            if (string.IsNullOrWhiteSpace(destino))
                destino = usuario;

            return (usuario, senha, destino);
        }

        public async Task EnviarContatoAsync(string nome, string email, string mensagem)
        {
            var (emailOrigem, senha, emailDestino) = ObterConfiguracaoEmail();

            if (!MailboxAddress.TryParse(email, out var replyAddress))
                throw new FormatException("E-mail do remetente inválido.");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Route Books", emailOrigem));
            message.To.Add(MailboxAddress.Parse(emailDestino));
            message.ReplyTo.Add(new MailboxAddress(nome, replyAddress.Address));
            message.Subject = "Novo contato pelo Route Books";

            message.Body = new TextPart("plain")
            {
                Text =
                    $"Novo contato recebido pelo site Route Books.\n\n" +
                    $"Nome: {nome}\n" +
                    $"E-mail: {replyAddress.Address}\n\n" +
                    $"Mensagem:\n{mensagem}"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(emailOrigem, senha);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }

        public async Task EnviarEmailRecuperacaoAsync(string emailDestino, string nomeUsuario, int idUsuario)
        {
            var (emailOrigem, senha, _) = ObterConfiguracaoEmail();

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Route Books", emailOrigem));
            message.To.Add(MailboxAddress.Parse(emailDestino));
            message.Subject = "Recuperação de Senha - Route Books";

            message.Body = new TextPart("html")
            {
                Text = $"<h3>Olá, {nomeUsuario}</h3>" +
                       $"<p>Você solicitou a recuperação de senha no Route Books.</p>" +
                       $"<p>Para cadastrar uma nova senha, utilize o seu ID de recuperação: <b>{idUsuario}</b></p>" +
                       $"<p>Se você não solicitou isso, ignore este e-mail.</p>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(emailOrigem, senha);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}