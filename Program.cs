using Microsoft.EntityFrameworkCore;
using PI_RouteBooks.Data;
using MongoDB.Driver;
using PI_RouteBooks.Services; // E-mail

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<EmailService>(); // E-mail 

// 1. CONFIGURAÇÃO DO BANCO DE DADOS (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
       connectionString,
        Microsoft.EntityFrameworkCore.ServerVersion.AutoDetect(connectionString)
    )
); 

// 2. CONFIGURAÇÃO DO CHAT (MongoDB)
var mongoConnectionString = builder.Configuration.GetConnectionString("MongoConnection");
var mongoClient = new MongoClient(mongoConnectionString);
builder.Services.AddSingleton<IMongoClient>(mongoClient);

// 3. CONFIGURAÇÃO DE SESSÃO E SERVIÇOS MVC
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews();

var app = builder.Build();

// 4. PIPELINE DE REQUISIÇÕES (Middlewares)
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseSession();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Posts}/{action=Index}/{id?}");

app.Run();
