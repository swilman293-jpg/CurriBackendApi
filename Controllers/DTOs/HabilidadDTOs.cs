using CurriBackendApi.Models;
using System.Collections.Generic;
namespace CurriBackendApi.DTOs
{
    public class HabilidadDTOs
    {
        // Las propiedades deben ser públicas y coincidir con el controlador
        public string Nombre { get; set; } = string.Empty;
        public string Nivel { get; set; } = string.Empty;
    }
}
