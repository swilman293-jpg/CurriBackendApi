using System.ComponentModel.DataAnnotations; // Necesario para definir el ID
using System.ComponentModel.DataAnnotations.Schema;
namespace CurriBackendApi.Models
{
    [Table("experiencia_laboral")]
    public class Experiencialaboral
    {
        [Key] // Esto le dice a EF que esta columna es la clave primaria
        
        public int Id_Expe { get; set; }
        public int ID_Usuario { get; set; }

        public string Experiencia { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public DateTime FechaIni { get; set; } 
        public DateTime FechaFin { get; set; } 
    }
}