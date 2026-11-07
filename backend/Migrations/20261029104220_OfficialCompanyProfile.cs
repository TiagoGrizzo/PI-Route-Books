using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Route_Books_api.Migrations
{
    /// <inheritdoc />
    public partial class OfficialCompanyProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PerfilOficial",
                table: "usuarios",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PerfilOficial",
                table: "usuarios");
        }
    }
}
