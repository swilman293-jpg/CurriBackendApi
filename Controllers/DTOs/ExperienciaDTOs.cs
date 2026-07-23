using CurriBackendApi.Models;
using System.Collections.Generic;
namespace CurriBackendApi.DTOs
{
    public class ExperiencialaboralDTOs
    {

        public int Id_Expe { get; set; }
        public int ID_Usuario { get; set; }

        public string Experiencia { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public DateTime FechaIni { get; set; }
        public DateTime FechaFin { get; set; }
    }
}
