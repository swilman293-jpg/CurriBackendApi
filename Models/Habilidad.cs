using System.ComponentModel.DataAnnotations; // Necesario para definir el ID
using System.ComponentModel.DataAnnotations.Schema;
namespace CurriBackendApi.Models
{
    [Table("tecnologias")]
    public class Habilidad
    {
        [Key] // Esto le dice a EF que esta columna es la clave primaria
        [Column("Id_tecnologia")]
        public int Id_tecnologia{ get; set; }
        public int ID_Usuario { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Nivel { get; set; } = string.Empty;   
    }
}

