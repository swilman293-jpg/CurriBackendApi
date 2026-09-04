using CurriBackendApi.Data;
using CurriBackendApi.DTOs;
using CurriBackendApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CurriBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperienciaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExperienciaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Habilidades
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.experiencia_laboral.ToListAsync());
        }

        // POST: api/Habilidades
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody] Experiencialaboral item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.experiencia_laboral.Add(item);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Guardado con éxito." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var e = await _context.experiencia_laboral.FindAsync(id);
            if (e == null) return NotFound();

            _context.experiencia_laboral.Remove(e);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Eliminado con éxito." });
        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] ExperiencialaboralDTOs dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var e = await _context.experiencia_laboral.FindAsync(id);
                if (e == null) return NotFound();

                e.Experiencia = dto.Experiencia;
                e.Cargo = dto.Cargo;
                e.FechaIni = dto.FechaIni;
                e.FechaFin = dto.FechaFin;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(e);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error al actualizar");
            }
        }
    }
}