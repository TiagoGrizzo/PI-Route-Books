using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Route_Books_api.Migrations
{
    /// <inheritdoc />
    public partial class VerifiedOrlandoCommunity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Verificada",
                table: "comunidades",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
            migrationBuilder.Sql("""
                INSERT INTO comunidades (Slug, Nome, Descricao, Icone, Verificada, CriadoEm)
                VALUES ('orlando-com-a-fran', 'Orlando com a Fran', 'Dicas, roteiros e experiências para aproveitar Orlando: parques, atrações, hospedagem e planejamento da viagem com a Fran.', '🏰', TRUE, UTC_TIMESTAMP())
                ON DUPLICATE KEY UPDATE Nome = VALUES(Nome), Descricao = VALUES(Descricao), Verificada = TRUE;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Verificada",
                table: "comunidades");
        }
    }
}
