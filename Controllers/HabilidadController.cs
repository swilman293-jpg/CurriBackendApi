using CurriBackendApi.Data;
using CurriBackendApi.Models;
using CurriBackendApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CurriBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabilidadesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HabilidadesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Habilidades
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Cambia 'tecnologias' por la tabla que corresponda en tu DbContext
            return Ok(await _context.tecnologias.ToListAsync());
        }

        // POST: api/Habilidades
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Habilidad item) // Usa tu clase real (Habilidad, Educacion...)
        {
            if (item == null) return BadRequest("Datos inválidos.");

            _context.tecnologias.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Guardado con éxito." });
        }
       

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HabilidadDTOs dto)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var h = await _context.tecnologias.FindAsync(id);
                    if (h == null) return NotFound();

                    // Mapeo manual: simple, directo y sin errores de EntityState
                    h.Nombre = dto.Nombre;
                    h.Nivel = dto.Nivel;

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
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



