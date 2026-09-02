using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;

var builder = WebApplication.CreateBuilder(args);

// Puerto asignado por Render/Docker de forma automática
// No es necesario forzar UseUrls, Render lo asigna internamente

// 1. Servicios
var connectionString = Environment.GetEnvironmentVariable("DefaultConnection") 
    ?? "Server=localhost;Port=5432;Database=curriculum_db;User=postgres;Password=";

builder.Services.AddDbContext<CurriBackendApi.Data.ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));
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

// Archivos estáticos - servir ambos HTMLs directamente
// UseStaticFiles() sirve archivos de wwwroot automáticamente
app.UseStaticFiles();

// Servir index.html en la ruta raíz
app.UseDefaultFiles();
// Esto asegurará que / muestre index.html

app.UseAuthorization();
app.MapControllers();

// 3. Verificación de BD - solo en desarrollo
if (app.Environment.IsDevelopment())
{
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
}

app.Run();