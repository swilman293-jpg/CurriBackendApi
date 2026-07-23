using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;

var builder = WebApplication.CreateBuilder(args);

// Railway asigna el puerto via variable de entorno PORT
var port = Environment.GetEnvironmentVariable("PORT") ?? "5179";
builder.WebHost.UseUrls($"http://+:{port}");

// 1. Servicios
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<CurriBackendApi.Data.ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Política CORS
builder.Services.AddCors(options => {
    options.AddPolicy("MiPoliticaCORS", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// 2. Middlewares (El orden importa)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("MiPoliticaCORS"); // Solo una vez es suficiente

// Archivos estáticos (para tu index.html y admin.html)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

// 3. Verificación de BD
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var contexto = services.GetRequiredService<CurriBackendApi.Data.ApplicationDbContext>();
        contexto.Database.EnsureCreated();
        Console.WriteLine("¡Base de datos y tablas verificadas con éxito!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error de base de datos: {ex.Message}");
    }
}

app.Run();