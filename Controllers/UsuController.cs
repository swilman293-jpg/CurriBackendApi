using CurriBackendApi.Data;
using CurriBackendApi.DTOs;
using CurriBackendApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CurriBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Habilidades
        [HttpGet]
        public async Task<IActionResult> Get()
        {

            return Ok(await _context.usuarios.ToListAsync());
        }

        // POST: api
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Usuarios item) // Usa tu clase real (Habilidad, Educacion...)
        {
            if (item == null) return BadRequest("Datos inválidos.");

            _context.usuarios.Add(item);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Guardado con éxito." });
        }

    
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UsuariosDTOs dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var u = await _context.usuarios.FindAsync(id);
                if (u == null) return NotFound();

                // Mapeo manual: simple, directo y sin errores de EntityState
                u.Nombre = dto.Nombre;
                u.Apellido = dto.Apellido;
                u.AcercaDe = dto.AcercaDe;
                u.Email = dto.Email;
                u.Telefono = dto.Telefono;
                u.LinkedinUrl = dto.LinkedinUrl;
                u.GithubUrl = dto.GithubUrl;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
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
