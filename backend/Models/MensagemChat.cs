using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Route_Books_api.Models;

public class MensagemChat
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public int RemetenteId { get; set; }
    public string RemetenteNome { get; set; } = string.Empty;

    public int DestinatarioId { get; set; }

    public string Texto { get; set; } = string.Empty;
    public DateTime EnviadoEm { get; set; }

    // Indica se o destinatário já visualizou a mensagem
    public bool Lida { get; set; } = false;
}
