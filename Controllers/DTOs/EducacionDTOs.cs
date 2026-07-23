using CurriBackendApi.Models;
using System.Collections.Generic;
namespace CurriBackendApi.DTOs
{
    public class EducacionDTOs
    {
        public int Id_Edu { get; set; }
        public int ID_Usuario { get; set; }
        public string Institución { get; set; } = string.Empty;
        public string Titulo_Obtenido { get; set; } = string.Empty;
        public DateTime Fecha_Inicio { get; set; }
        public DateTime Fecha_Fin { get; set; }
    }
}
