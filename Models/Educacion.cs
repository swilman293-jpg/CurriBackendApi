using System.ComponentModel.DataAnnotations; // Necesario para definir el ID
using System.ComponentModel.DataAnnotations.Schema;
namespace CurriBackendApi.Models
{
    [Table("educación")]
    public class Educacion
    {
        [Key] // Esto le dice a EF que esta columna es la clave primaria
        public int Id_Edu { get; set; }
        public int ID_Usuario { get; set; }
        public string Institución { get; set; } = string.Empty;
        public string Titulo_Obtenido { get; set; } = string.Empty;
        public DateTime Fecha_Inicio { get; set; } 
        public DateTime Fecha_Fin { get; set; } 
    }
}