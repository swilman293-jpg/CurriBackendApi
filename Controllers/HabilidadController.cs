using CurriBackendApi.Data;
using CurriBackendApi.Models;
using CurriBackendApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;

namespace CurriBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabilidadesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IOutputCacheStore _cache;

        public HabilidadesController(ApplicationDbContext context, IOutputCacheStore cache)
        {
            _context = context;
            _cache = cache;
        }

        // 1. GET: api/Habilidades
        [HttpGet]
        [OutputCache(Duration = 120, Tags = new[] { "listas" })]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.tecnologias.AsNoTracking().ToListAsync());
        }

        // POST: api/Habilidades
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody] Habilidad item)
        {
            if (item == null) return BadRequest("Datos inválidos.");

            _context.tecnologias.Add(item);
            await _context.SaveChangesAsync();
            await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);

            return Ok(new { mensaje = "Guardado con éxito." });
        }
       
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var h = await _context.tecnologias.FindAsync(id);
            if (h == null) return NotFound();

            _context.tecnologias.Remove(h);
            await _context.SaveChangesAsync();
            await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);

            return Ok(new { mensaje = "Eliminado con éxito." });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] HabilidadDTOs dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var h = await _context.tecnologias.FindAsync(id);
                if (h == null) return NotFound();

                h.Nombre = dto.Nombre;
                h.Nivel = dto.Nivel;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);
                return Ok(h);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error al actualizar");
            }
        }
    }
}