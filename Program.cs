using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Expressions;

var builder = WebApplication.CreateBuilder(args);

// Configurar conexión a base de datos - Render inyectará la variable DefaultConnection
// Si no existe, usamos un valor por defecto seguro para que la app inicie
var connectionString = Environment.GetEnvironmentVariable("DefaultConnection");

builder.Services.AddDbContext<CurriBackendApi.Data.ApplicationDbContext>(options =>
{
    if (string.IsNullOrEmpty(connectionString))
    {
        // Valor por defecto si no hay variable de entorno (desarrollo local)
        options.UseNpgsql("Server=localhost;Port=5432;Database=curriculum_db;User=postgres;");
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});
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
app.UseCors("MiPoliticaCORS");

// Archivos estáticos - servir ambos HTMLs directamente
// USE STATIC FILES SIN MAPGETS - esto evita el error 404 y descarga de archivo
app.UseStaticFiles();

// Que la ruta raíz / sirva index.html automáticamente
app.UseDefaultFiles();

// Authorization y controladores
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