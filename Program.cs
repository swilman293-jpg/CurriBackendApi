using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configurar conexión a base de datos - Render inyectará la variable DefaultConnection
// Si no existe, usamos un valor por defecto seguro para que la app inicie
var connectionString = Environment.GetEnvironmentVariable("DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<CurriBackendApi.Data.ApplicationDbContext>(options =>
{
    if (string.IsNullOrEmpty(connectionString))
    {
        // Valor por defecto para desarrollo local (contenedor Docker)
        options.UseNpgsql("Server=localhost;Port=5435;Database=curriculum_db;User Id=postgres;Password=postgres;");
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});

// Configurar JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "CurriBackendApi_SuperSecretKey_2026_LongEnoughForHS256!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CurriBackendApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CurriBackendApiUsers";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddSingleton<CurriBackendApi.Services.ImagenService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Política CORS
builder.Services.AddCors(options => {
    options.AddPolicy("MiPoliticaCORS", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// 2. Middlewares (El orden importa)
// Confiar en los proxies (Render/Railway) para conservar HTTPS correcto
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

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
// Que la ruta raíz / sirva index.html automáticamente
app.UseDefaultFiles();
app.UseStaticFiles();

// Authentication y Authorization
app.UseAuthentication();
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