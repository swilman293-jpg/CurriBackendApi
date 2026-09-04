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

        public DbSet<AdminUser> admin_users { get; set; }

        public DbSet<Prueba> pruebas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Prueba>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Descripcion).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.ImagenUrl).IsRequired().HasMaxLength(500);
                entity.Property(e => e.JwtToken).HasMaxLength(2000);
                entity.Property(e => e.UsuarioEmail).HasMaxLength(200);
                entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone");
            });

            modelBuilder.Entity<AdminUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasColumnType("timestamp with time zone");
                entity.HasIndex(e => e.Email).IsUnique();
            });

            modelBuilder.Entity<Educacion>(entity =>
            {
                entity.Property(e => e.Fecha_Inicio).HasColumnType("timestamp without time zone");
                entity.Property(e => e.Fecha_Fin).HasColumnType("timestamp without time zone");
            });

            modelBuilder.Entity<Experiencialaboral>(entity =>
            {
                entity.Property(e => e.FechaIni).HasColumnType("timestamp without time zone");
                entity.Property(e => e.FechaFin).HasColumnType("timestamp without time zone");
            });
        }
    }
}
