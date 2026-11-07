using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Route_Books_api.Migrations
{
    /// <inheritdoc />
    public partial class DemoCommunities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ComunidadeId",
                table: "posts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagemFonteUrl",
                table: "posts",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "comunidades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Slug = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Nome = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Descricao = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Icone = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CriadoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comunidades", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "comunidade_membros",
                columns: table => new
                {
                    ComunidadeId = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comunidade_membros", x => new { x.ComunidadeId, x.UsuarioId });
                    table.ForeignKey(
                        name: "FK_comunidade_membros_comunidades_ComunidadeId",
                        column: x => x.ComunidadeId,
                        principalTable: "comunidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_comunidade_membros_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_posts_ComunidadeId",
                table: "posts",
                column: "ComunidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_comunidade_membros_UsuarioId",
                table: "comunidade_membros",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_comunidades_Slug",
                table: "comunidades",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_posts_comunidades_ComunidadeId",
                table: "posts",
                column: "ComunidadeId",
                principalTable: "comunidades",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_posts_comunidades_ComunidadeId",
                table: "posts");

            migrationBuilder.DropTable(
                name: "comunidade_membros");

            migrationBuilder.DropTable(
                name: "comunidades");

            migrationBuilder.DropIndex(
                name: "IX_posts_ComunidadeId",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "ComunidadeId",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "ImagemFonteUrl",
                table: "posts");
        }
    }
}
