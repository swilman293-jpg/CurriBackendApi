using CurriBackendApi.Data;
using CurriBackendApi.Models;
using CurriBackendApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CurriBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PruebaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly ImagenService _imagenService;

        public PruebaController(ApplicationDbContext context, IWebHostEnvironment environment, ImagenService imagenService)
        {
            _context = context;
            _environment = environment;
            _imagenService = imagenService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.pruebas.OrderByDescending(p => p.CreatedAt).ToListAsync());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromForm] PruebaDto dto)
        {
            if (string.IsNullOrEmpty(dto.Descripcion))
            {
                return BadRequest(new { message = "La descripción es requerida" });
            }

            var (imagenUrl, publicId) = await GuardarImagenAsync(dto.Imagen, string.Empty, null);

            var prueba = new Prueba
            {
                Descripcion = dto.Descripcion,
                ImagenUrl = imagenUrl ?? string.Empty,
                PublicId = publicId,
                Grupo = dto.Grupo ?? string.Empty,
                JwtToken = dto.JwtToken ?? string.Empty,
                UsuarioEmail = dto.UsuarioEmail ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

            _context.pruebas.Add(prueba);
            await _context.SaveChangesAsync();

            return Ok(prueba);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] PruebaDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var prueba = await _context.pruebas.FindAsync(id);
                if (prueba == null) return NotFound();

                prueba.Descripcion = dto.Descripcion ?? prueba.Descripcion;
                prueba.Grupo = dto.Grupo ?? prueba.Grupo;
                prueba.JwtToken = dto.JwtToken ?? prueba.JwtToken;
                prueba.UsuarioEmail = dto.UsuarioEmail ?? prueba.UsuarioEmail;

                if (dto.Imagen != null && dto.Imagen.Length > 0)
                {
                    var (imagenUrl, publicId) = await GuardarImagenAsync(dto.Imagen, prueba.ImagenUrl, prueba.PublicId);
                    prueba.ImagenUrl = imagenUrl ?? prueba.ImagenUrl;
                    prueba.PublicId = publicId ?? prueba.PublicId;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(prueba);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error al actualizar");
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var prueba = await _context.pruebas.FindAsync(id);
            if (prueba == null) return NotFound();

            await EliminarSiExiste(prueba.ImagenUrl, prueba.PublicId);

            _context.pruebas.Remove(prueba);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Eliminado con éxito." });
        }

        private async Task<(string? Url, string? PublicId)> GuardarImagenAsync(IFormFile? imagen, string urlActual, string? publicIdActual)
        {
            if (imagen == null || imagen.Length == 0) return (null, null);

            var subida = await _imagenService.SubirImagenAsync(imagen);
            if (subida != null)
            {
                await EliminarSiExiste(urlActual, publicIdActual);
                return (subida.Value.Url, subida.Value.PublicId);
            }

            var uploadsDir = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsDir);

            var extension = Path.GetExtension(imagen.FileName).ToLower();
            var nombreArchivo = $"{Guid.NewGuid():N}{extension}";
            var rutaCompleta = Path.Combine(uploadsDir, nombreArchivo);

            using (var stream = new FileStream(rutaCompleta, FileMode.Create))
            {
                await imagen.CopyToAsync(stream);
            }

            await EliminarSiExiste(urlActual, publicIdActual);
            return ($"/uploads/{nombreArchivo}", null);
        }

        private async Task EliminarSiExiste(string? urlActual, string? publicIdActual)
        {
            if (!string.IsNullOrEmpty(publicIdActual))
            {
                await _imagenService.EliminarImagenAsync(publicIdActual);
                return;
            }

            if (!string.IsNullOrEmpty(urlActual) && urlActual.StartsWith("/"))
            {
                var rutaVieja = Path.Combine(_environment.WebRootPath ?? "wwwroot", urlActual.TrimStart('/'));
                if (System.IO.File.Exists(rutaVieja))
                {
                    System.IO.File.Delete(rutaVieja);
                }
            }
        }
    }

    public class PruebaDto
    {
        public string? Descripcion { get; set; }
        public string? Grupo { get; set; }
        public string? JwtToken { get; set; }
        public string? UsuarioEmail { get; set; }
        public IFormFile? Imagen { get; set; }
    }
}