using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CurriBackendApi.Models
{
    [Table("pruebas")]
    public class Prueba
    {
        [Key]
        public int Id { get; set; }

        public string Descripcion { get; set; } = string.Empty;

        public string ImagenUrl { get; set; } = string.Empty;

        public string? PublicId { get; set; }

        public string Grupo { get; set; } = string.Empty;

        public string JwtToken { get; set; } = string.Empty;

        public string UsuarioEmail { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}