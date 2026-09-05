using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CurriBackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPruebaCloudinaryPublicId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "pruebas",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "pruebas");
        }
    }
}
