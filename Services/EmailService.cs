using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;


namespace PI_RouteBooks.Services
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
    }
}