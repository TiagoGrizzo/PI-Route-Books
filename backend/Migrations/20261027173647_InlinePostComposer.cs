using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Route_Books_api.Migrations
{
    /// <inheritdoc />
    public partial class InlinePostComposer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_posts_usuarios_UsuariosIdUsuario",
                table: "posts");

            migrationBuilder.AlterColumn<int>(
                name: "UsuariosIdUsuario",
                table: "posts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<decimal>(
                name: "AvaliacaoLugar",
                table: "posts",
                type: "decimal(3,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Localizacao",
                table: "posts",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TipoMidia",
                table: "posts",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_posts_usuarios_UsuariosIdUsuario",
                table: "posts",
                column: "UsuariosIdUsuario",
                principalTable: "usuarios",
                principalColumn: "id_usuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_posts_usuarios_UsuariosIdUsuario",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "AvaliacaoLugar",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "Localizacao",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "TipoMidia",
                table: "posts");

            migrationBuilder.AlterColumn<int>(
                name: "UsuariosIdUsuario",
                table: "posts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_posts_usuarios_UsuariosIdUsuario",
                table: "posts",
                column: "UsuariosIdUsuario",
                principalTable: "usuarios",
                principalColumn: "id_usuario",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
