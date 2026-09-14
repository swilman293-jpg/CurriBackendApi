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
    public class EducacionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IOutputCacheStore _cache;

        public EducacionController(ApplicationDbContext context, IOutputCacheStore cache)
        {
            _context = context;
            _cache = cache;
        }

        // 1. GET: api/
        [HttpGet]
        [OutputCache(Duration = 120, Tags = new[] { "listas" })]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.educación.AsNoTracking().ToListAsync());
        }

        // POST: api/
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody] Educacion item)
        {
            try
            {
                if (item == null) return BadRequest("Datos inválidos.");

                _context.educación.Add(item);
                await _context.SaveChangesAsync();
                await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);

                return Ok(new { mensaje = "Guardado con éxito." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al guardar en BD: " + ex.InnerException?.Message ?? ex.Message);
            }
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var ed = await _context.educación.FindAsync(id);
            if (ed == null) return NotFound();

            _context.educación.Remove(ed);
            await _context.SaveChangesAsync();
            await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);

            return Ok(new { mensaje = "Eliminado con éxito." });
        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] EducacionDTOs dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var ed = await _context.educación.FindAsync(id);
                if (ed == null) return NotFound();

                ed.Institución = dto.Institución;
                ed.Titulo_Obtenido = dto.Titulo_Obtenido;
                ed.Fecha_Inicio = dto.Fecha_Inicio;
                ed.Fecha_Fin = dto.Fecha_Fin;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                await _cache.EvictByTagAsync("listas", HttpContext.RequestAborted);
                return Ok(ed);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error al actualizar");
            }
        }
    }
}