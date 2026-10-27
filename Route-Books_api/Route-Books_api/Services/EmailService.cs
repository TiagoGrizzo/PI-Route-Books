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

        public async Task EnviarContatoAsync(
            string nome,
            string email,
            string mensagem)
        {
            var emailOrigem = _configuration["Email:Usuario"];
            var senha = _configuration["Email:Senha"];
            var emailDestino = _configuration["Email:Destino"];

            var message = new MimeMessage();

            message.From.Add(
                new MailboxAddress("Route Books", emailOrigem)
            );

            message.To.Add(
                MailboxAddress.Parse(emailDestino)
            );

            message.ReplyTo.Add(
                new MailboxAddress(nome, email)
            );

            message.Subject = "Novo contato pelo Route Books";

            message.Body = new TextPart("plain")
            {
                Text =
                    $"Novo contato recebido pelo site Route Books.\n\n" +
                    $"Nome: {nome}\n" +
                    $"E-mail: {email}\n\n" +
                    $"Mensagem:\n{mensagem}"
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                "smtp.gmail.com",
                587,
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                emailOrigem,
                senha
            );

            await smtp.SendAsync(message);

            await smtp.DisconnectAsync(true);
        }
        public async Task EnviarEmailRecuperacaoAsync(string emailDestino, string nomeUsuario, int idUsuario)
        {
            var emailOrigem = _configuration["Email:Usuario"];
            var senha = _configuration["Email:Senha"];

            var message = new MimeMessage();

            message.From.Add(new MailboxAddress("Route Books", emailOrigem));
            message.To.Add(MailboxAddress.Parse(emailDestino));
            message.Subject = "Recuperação de Senha - Route Books";

            // Aqui você pode montar o link que vai para o seu Front-end em React
            // Exemplo: http://localhost:3000/nova-senha?id={idUsuario}
            message.Body = new TextPart("html")
            {
                Text = $"<h3>Olá, {nomeUsuario}</h3>" +
                       $"<p>Você solicitou a recuperação de senha no Route Books.</p>" +
                       $"<p>Para cadastrar uma nova senha, utilize o seu ID de recuperação: <b>{idUsuario}</b></p>" +
                       $"<p>Se você não solicitou isso, ignore este e-mail.</p>"
            };

            using var smtp = new SmtpClient();

            // Dica: use o SecureSocketOptions.Auto ou SslOnConnect dependendo da porta (587 usa StartTls)
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(emailOrigem, senha);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}