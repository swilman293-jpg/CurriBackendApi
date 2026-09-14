using CurriBackendApi.Data;
using CurriBackendApi.DTOs;
using CurriBackendApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;

namespace CurriBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IOutputCacheStore _cache;

        public UsuController(ApplicationDbContext context, IOutputCacheStore cache)
        {
            _context = context;
            _cache = cache;
        }

        // 1. GET: api/Habilidades
        [HttpGet]
        [OutputCache(Duration = 120, Tags = new[] { "listas" })]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.usuarios.AsNoTracking().ToListAsync());
        }

        // POST: api
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody] Usuarios item)
        {
            if (item == null) return BadRequest("Datos inválidos.");

            _context.usuarios.Add(item);
            await _context.SaveChangesAsync();
            await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);

            return Ok(new { mensaje = "Guardado con éxito." });
        }
    
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var u = await _context.usuarios.FindAsync(id);
            if (u == null) return NotFound();

            _context.usuarios.Remove(u);
            await _context.SaveChangesAsync();
            await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);

            return Ok(new { mensaje = "Eliminado con éxito." });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UsuariosDTOs dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var u = await _context.usuarios.FindAsync(id);
                if (u == null) return NotFound();

                u.Nombre = dto.Nombre;
                u.Apellido = dto.Apellido;
                u.TituloProfesional = dto.TituloProfesional;
                u.AcercaDe = dto.AcercaDe;
                u.Email = dto.Email;
                u.Telefono = dto.Telefono;
                u.LinkedinUrl = dto.LinkedinUrl;
                u.GithubUrl = dto.GithubUrl;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);
                return Ok(u);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error al actualizar");
            }
        }
    }
}