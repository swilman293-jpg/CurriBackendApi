using CurriBackendApi.Data;
using CurriBackendApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

namespace CurriBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { message = "Email y contraseña son requeridos" });
            }

            var adminUser = await _context.admin_users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

            if (adminUser == null)
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, adminUser.PasswordHash))
            {
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            var token = GenerateJwtToken(adminUser);

            return Ok(new
            {
                token,
                user = new
                {
                    adminUser.Id,
                    adminUser.Email,
                    adminUser.Role
                }
            });
        }

        [Authorize]
        [HttpGet("verificar")]
        public IActionResult Verificar()
        {
            var email = User.Identity?.Name;
            if (string.IsNullOrEmpty(email))
            {
                email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            }
            return Ok(new { valido = true, email });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest(new { message = "Email y contraseña son requeridos" });
            }

            var existingUser = await _context.admin_users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
            {
                return BadRequest(new { message = "El email ya está registrado" });
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var adminUser = new AdminUser
            {
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.admin_users.Add(adminUser);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(adminUser);

            return Ok(new
            {
                token,
                user = new
                {
                    adminUser.Id,
                    adminUser.Email,
                    adminUser.Role
                }
            });
        }

        private string GenerateJwtToken(AdminUser user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "CurriBackendApi_SuperSecretKey_2026_LongEnoughForHS256!";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "CurriBackendApi";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "CurriBackendApiUsers";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}