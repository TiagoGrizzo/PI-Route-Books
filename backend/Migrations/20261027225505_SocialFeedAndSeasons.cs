using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Route_Books_api.Migrations
{
    /// <inheritdoc />
    public partial class SocialFeedAndSeasons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CapaUrl",
                table: "usuarios",
                type: "varchar(300)",
                maxLength: 300,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Valor",
                table: "curtidas",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "RespostaId",
                table: "comentarios",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "temporadas_destinos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Mes = table.Column<int>(type: "int", nullable: false),
                    DiaInicio = table.Column<int>(type: "int", nullable: false),
                    DiaFim = table.Column<int>(type: "int", nullable: false),
                    Ordem = table.Column<int>(type: "int", nullable: false),
                    Pais = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Descricao = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Icone = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_temporadas_destinos", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "temporadas_destinos",
                columns: new[] { "Id", "Descricao", "DiaFim", "DiaInicio", "Icone", "Mes", "Ordem", "Pais" },
                values: new object[,]
                {
                    { 1, "Disney e Férias / Temporada Ativa", 31, 1, "fa-globe", 1, 1, "Estados Unidos (Flórida)" },
                    { 2, "Férias e Verão / Temporada Ativa", 31, 1, "fa-sun-o", 1, 2, "Argentina" },
                    { 3, "Inverno Ameno / Temporada Ativa", 31, 1, "fa-snowflake-o", 1, 3, "Portugal" },
                    { 4, "Época Seca no Caribe / Temporada Ativa", 31, 1, "fa-sun-o", 1, 4, "México" },
                    { 5, "Outlets e Pós-Festas / Temporada Ativa", 29, 1, "fa-globe", 2, 1, "Estados Unidos" },
                    { 6, "Férias de Verão / Temporada Ativa", 29, 1, "fa-sun-o", 2, 2, "Argentina" },
                    { 7, "Turismo Gastronômico / Temporada Ativa", 29, 1, "fa-globe", 2, 3, "Portugal" },
                    { 8, "Sol e Praias do Caribe / Temporada Ativa", 29, 1, "fa-sun-o", 2, 4, "México" },
                    { 9, "Sakura e Turismo / Temporada Ativa", 31, 1, "fa-leaf", 3, 1, "Japão (Floração das Cerejeiras)" },
                    { 10, "Início da Primavera / Temporada Ativa", 31, 1, "fa-leaf", 3, 2, "Estados Unidos" },
                    { 11, "Primavera Antecipada / Temporada Ativa", 31, 1, "fa-leaf", 3, 3, "Portugal" },
                    { 12, "Colheita de Vinhos / Temporada Ativa", 31, 1, "fa-globe", 3, 4, "Argentina" },
                    { 13, "Primavera no Algarve / Temporada Ativa", 30, 1, "fa-leaf", 4, 1, "Portugal" },
                    { 14, "Clima Ameno / Temporada Ativa", 30, 1, "fa-globe", 4, 2, "Itália" },
                    { 15, "Paris e Dias Longos / Temporada Ativa", 30, 1, "fa-globe", 4, 3, "França" },
                    { 16, "Parques na Primavera / Temporada Ativa", 30, 1, "fa-leaf", 4, 4, "Estados Unidos (Nova York)" },
                    { 17, "Pré-Verão Ameno / Temporada Ativa", 31, 1, "fa-sun-o", 5, 1, "Itália" },
                    { 18, "Temperaturas Ideais / Temporada Ativa", 31, 1, "fa-globe", 5, 2, "Portugal" },
                    { 19, "Sol Mediterrâneo / Temporada Ativa", 31, 1, "fa-sun-o", 5, 3, "Espanha" },
                    { 20, "Festivais de Primavera / Temporada Ativa", 31, 1, "fa-leaf", 5, 4, "França" },
                    { 21, "Frio e Neve / Temporada Ativa", 30, 1, "fa-snowflake-o", 6, 1, "Chile (Temporada de Neve)" },
                    { 22, "Inverno e Neve / Temporada Ativa", 30, 1, "fa-snowflake-o", 6, 2, "Argentina (Esqui na Patagônia)" },
                    { 23, "Início do Verão / Temporada Ativa", 30, 1, "fa-sun-o", 6, 3, "Itália" },
                    { 24, "Festas Populares / Temporada Ativa", 30, 1, "fa-globe", 6, 4, "Portugal" },
                    { 25, "Esqui e Férias / Temporada Ativa", 31, 1, "fa-snowflake-o", 7, 1, "Chile (Auge da Neve)" },
                    { 26, "Neve e Montanha / Temporada Ativa", 31, 1, "fa-snowflake-o", 7, 2, "Argentina (Inverno Patagônico)" },
                    { 27, "Férias e Parques / Temporada Ativa", 31, 1, "fa-globe", 7, 3, "Estados Unidos (Orlando)" },
                    { 28, "Verão e Praias / Temporada Ativa", 31, 1, "fa-sun-o", 7, 4, "Portugal" },
                    { 29, "Esqui e Fim da Neve / Temporada Ativa", 31, 1, "fa-snowflake-o", 8, 1, "Chile" },
                    { 30, "Últimas Neves / Temporada Ativa", 31, 1, "fa-snowflake-o", 8, 2, "Argentina" },
                    { 31, "Férias Locais / Temporada Ativa", 31, 1, "fa-globe", 8, 3, "Portugal" },
                    { 32, "Outlets no Verão / Temporada Ativa", 31, 1, "fa-sun-o", 8, 4, "Estados Unidos" },
                    { 33, "Outono Calmo / Temporada Ativa", 30, 1, "fa-leaf", 9, 1, "Portugal" },
                    { 34, "Sem Multidões / Temporada Ativa", 30, 1, "fa-globe", 9, 2, "Itália" },
                    { 35, "Paris Romântica / Temporada Ativa", 30, 1, "fa-globe", 9, 3, "França" },
                    { 36, "Buenos Aires Agradável / Temporada Ativa", 30, 1, "fa-globe", 9, 4, "Argentina" },
                    { 37, "Halloween na Disney / Temporada Ativa", 31, 1, "fa-globe", 10, 1, "Estados Unidos" },
                    { 38, "Clima Ameno / Temporada Ativa", 31, 1, "fa-globe", 10, 2, "Portugal" },
                    { 39, "Folhas de Outono (Koyo) / Temporada Ativa", 31, 1, "fa-leaf", 10, 3, "Japão" },
                    { 40, "Primavera Porteña / Temporada Ativa", 31, 1, "fa-leaf", 10, 4, "Argentina" },
                    { 41, "Black Friday e Compras / Temporada Ativa", 30, 1, "fa-globe", 11, 1, "Estados Unidos" },
                    { 42, "Feriados e Escapadas / Temporada Ativa", 30, 1, "fa-globe", 11, 2, "Argentina" },
                    { 43, "Atacama e Lagos / Temporada Ativa", 30, 1, "fa-globe", 11, 3, "Chile" },
                    { 44, "Baixa Temporada Acolhedora / Temporada Ativa", 30, 1, "fa-globe", 11, 4, "Portugal" },
                    { 45, "Natal em Nova York / Temporada Ativa", 31, 1, "fa-globe", 12, 1, "Estados Unidos" },
                    { 46, "Mercados de Natal / Temporada Ativa", 31, 1, "fa-globe", 12, 2, "França (Paris)" },
                    { 47, "Festividades de Fim de Ano / Temporada Ativa", 31, 1, "fa-globe", 12, 3, "Portugal" },
                    { 48, "Viagens de Férias / Temporada Ativa", 31, 1, "fa-globe", 12, 4, "Argentina" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_comentarios_RespostaId",
                table: "comentarios",
                column: "RespostaId");

            migrationBuilder.CreateIndex(
                name: "IX_temporadas_destinos_Mes_Ordem",
                table: "temporadas_destinos",
                columns: new[] { "Mes", "Ordem" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_comentarios_comentarios_RespostaId",
                table: "comentarios",
                column: "RespostaId",
                principalTable: "comentarios",
                principalColumn: "IdComentario",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_comentarios_comentarios_RespostaId",
                table: "comentarios");

            migrationBuilder.DropTable(
                name: "temporadas_destinos");

            migrationBuilder.DropIndex(
                name: "IX_comentarios_RespostaId",
                table: "comentarios");

            migrationBuilder.DropColumn(
                name: "CapaUrl",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "Valor",
                table: "curtidas");

            migrationBuilder.DropColumn(
                name: "RespostaId",
                table: "comentarios");
        }
    }
}
