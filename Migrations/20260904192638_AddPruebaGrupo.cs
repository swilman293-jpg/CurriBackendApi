using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CurriBackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPruebaGrupo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Grupo",
                table: "pruebas",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Grupo",
                table: "pruebas");
        }
    }
}
