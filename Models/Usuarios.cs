using System.ComponentModel.DataAnnotations; // Necesario para definir el ID
using System.ComponentModel.DataAnnotations.Schema;
namespace CurriBackendApi.Models
{
    [Table("Usuario")]
    public class Usuarios
    {
        [Key] // Esto le dice a EF que esta columna es la clave primaria
        public int ID_Usuario { get; set; }

        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string TituloProfesional { get; set; } = string.Empty;
        public string AcercaDe { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string LinkedinUrl { get; set; } = string.Empty;
        public string GithubUrl { get; set; } = string.Empty;
    }
}