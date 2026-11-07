using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using MongoDB.Bson;
using Route_Books_api.Data;
using Route_Books_api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Habilita a leitura de anotações como [SwaggerOperation]
    c.EnableAnnotations();
});

// Configurações do MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection não configurada.");
var mysqlConnection = new MySqlConnector.MySqlConnectionStringBuilder(connectionString)
{
    ConnectionTimeout = 5
};
connectionString = mysqlConnection.ConnectionString;
Microsoft.EntityFrameworkCore.ServerVersion mysqlVersion;

try
{
    mysqlVersion = Microsoft.EntityFrameworkCore.ServerVersion.AutoDetect(connectionString);
    Console.WriteLine($"[MySQL] Conectado em {mysqlConnection.Server}:{mysqlConnection.Port}/{mysqlConnection.Database}.");
}
catch (Exception ex)
{
    mysqlVersion = new MySqlServerVersion(new Version(8, 0, 0));
    Console.WriteLine($"[MySQL] Sem conexão em {mysqlConnection.Server}:{mysqlConnection.Port}/{mysqlConnection.Database}: {ex.Message}");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, mysqlVersion)
);

// Configurações do MongoDB
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:MongoConnection não configurada.");
var mongoSettings = MongoClientSettings.FromConnectionString(mongoConnectionString);
mongoSettings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
var mongoClient = new MongoClient(mongoSettings);
var mongoUrl = MongoUrl.Create(mongoConnectionString);
builder.Services.AddSingleton<IMongoClient>(mongoClient);

// Configuração da Autenticação JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret não configurado.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };

    // 🌟 ADICIONADO: Faz o .NET ler o token JWT de dentro do seu cookie "auth_token"
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            context.Token = context.Request.Cookies["auth_token"];
            return Task.CompletedTask;
        }
    };
});

// Registra o serviço de e-mail para poder injetar nos controllers
builder.Services.AddTransient<EmailService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Obrigatório para aceitar cookies HttpOnly (JWT)
    });
});

var app = builder.Build();
// Populando os exemplos somente quando o comando for solicitado.
if (args.Contains("--seed-pinterest")) {
    using var scope = app.Services.CreateScope();
    await PinterestDemoSeed.Executar(scope.ServiceProvider.GetRequiredService<ApplicationDbContext>());
    return;
}
if (args.Contains("--seed-official")) {
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    await PerfilOficialSeed.Executar(db);
    return;
}
if (args.Contains("--assign-avatars")) {
    using var scope = app.Services.CreateScope();
    await AvataresPadrao.PreencherExistentes(scope.ServiceProvider.GetRequiredService<ApplicationDbContext>());
    return;
}
if (args.Contains("--seed-demo")) {
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    await DemoSeed.Executar(db);
    await AvataresPadrao.PreencherExistentes(db);
    return;
}

if (app.Environment.IsDevelopment())
{
    // Dando início à criação do banco local quando ele ainda não existe.
    try
    {
        using var scopeBanco = app.Services.CreateScope();
        var banco = scopeBanco.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await banco.Database.MigrateAsync();
        await AvataresPadrao.PreencherExistentes(banco);
        Console.WriteLine("[MySQL] Banco Route_Books pronto; migrações aplicadas.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[MySQL] Não foi possível preparar o banco Route_Books: {ex.GetBaseException().Message}");
    }
}

// Dando início à checagem do MongoDB para confirmar a conexão ao subir a API.
try
{
    await mongoClient.GetDatabase("RouteBooksChat")
        .RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1));
    Console.WriteLine($"[MongoDB] Conectado em {mongoUrl.Server.Host}:{mongoUrl.Server.Port}/RouteBooksChat.");
}
catch
{
    Console.WriteLine($"[MongoDB] Sem conexão em {mongoUrl.Server.Host}:{mongoUrl.Server.Port}/RouteBooksChat. Verifique se o MongoDB está iniciado.");
}

app.Lifetime.ApplicationStarted.Register(() =>
{
    var addresses = app.Services.GetRequiredService<IServer>()
        .Features.Get<IServerAddressesFeature>()?.Addresses;

    if (addresses is { Count: > 0 })
    {
        foreach (var address in addresses)
            Console.WriteLine($"[Route Books API] Rodando em {address}");
    }
});

// Ative o CORS (ATENÇÃO: Deve vir antes de UseAuthorization e MapControllers)
app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    // Ativa o Swagger UI clássico
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Route Books API V1");
        //c.RoutePrefix = string.Empty; // Faz o Swagger abrir direto na raiz (ex: http://localhost:5123/)
    });
}

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

