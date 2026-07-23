using CurriBackendApi.Models;
using System.Collections.Generic;
namespace CurriBackendApi.DTOs
{
    public class CurriculumDTO
    {
        public Usuarios Usuario { get; set; } = new Usuarios();

        public List<Experiencialaboral> Experiencias { get; set; } = new List<Experiencialaboral>();
        public List<Educacion> Educaciones { get; set; } = new List<Educacion>();

        public List<Habilidad> Habilidades { get; set; } = new List<Habilidad>();
    }
}
