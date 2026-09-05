using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace CurriBackendApi.Services
{
    public class ImagenService
    {
        private readonly Cloudinary _cloudinary;

        public ImagenService(IConfiguration configuration)
        {
            var cloudName = configuration["Cloudinary:CloudName"] ?? string.Empty;
            var apiKey = configuration["Cloudinary:ApiKey"] ?? string.Empty;
            var apiSecret = configuration["Cloudinary:ApiSecret"] ?? string.Empty;

            _cloudinary = string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret)
                ? null!
                : new Cloudinary(new Account(cloudName, apiKey, apiSecret));
        }

        public bool Configurado => _cloudinary != null;

        public async Task<(string Url, string PublicId)?> SubirImagenAsync(IFormFile archivo, string carpeta = "pruebas")
        {
            if (!Configurado || archivo == null || archivo.Length == 0) return null;

            using var stream = archivo.OpenReadStream();
            var extension = Path.GetExtension(archivo.FileName).ToLower() switch
            {
                ".jpg" or ".jpeg" => "jpg",
                ".png" => "png",
                ".webp" => "webp",
                ".gif" => "gif",
                _ => "jpg"
            };

            var resultado = await _cloudinary.UploadAsync(new ImageUploadParams
            {
                File = new FileDescription(archivo.FileName, stream),
                Folder = carpeta,
                Format = extension,
                Overwrite = false,
                UseFilename = true,
                UniqueFilename = true
            });

            if (resultado.Error != null)
            {
                throw new InvalidOperationException($"Error de Cloudinary: {resultado.Error.Message}");
            }

            return (resultado.SecureUrl.ToString(), resultado.PublicId);
        }

        public async Task EliminarImagenAsync(string? publicId)
        {
            if (!Configurado || string.IsNullOrEmpty(publicId)) return;

            await _cloudinary.DestroyAsync(new DeletionParams(publicId)
            {
                ResourceType = ResourceType.Image
            });
        }
    }
}