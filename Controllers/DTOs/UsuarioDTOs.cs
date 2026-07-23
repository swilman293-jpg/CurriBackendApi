using CurriBackendApi.Models;
using System.Collections.Generic;
namespace CurriBackendApi.DTOs
{
    public class UsuariosDTOs
    {

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
