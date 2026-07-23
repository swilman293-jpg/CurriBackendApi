using CurriBackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CurriBackendApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) : base(options)
        {
        }

        public DbSet<Habilidad> tecnologias { get; set; }

        public DbSet<Educacion> educación { get; set; }

        public DbSet<Experiencialaboral> experiencia_laboral { get; set; }

        public DbSet<Usuarios> usuarios { get; set; }
    }
}
