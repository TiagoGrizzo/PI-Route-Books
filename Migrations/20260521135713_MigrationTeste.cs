using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PI_RouteBooks.Migrations
{
    /// <inheritdoc />
    public partial class MigrationTeste : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categorias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrdemExibicao = table.Column<int>(type: "int", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorias", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    id_tag = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nome = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tags", x => x.id_tag);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tipos",
                columns: table => new
                {
                    id_tipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    descricao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tipos", x => x.id_tipo);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id_usuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    username = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nome_completo = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    telefone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    senha_hash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    uf = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    biografia = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    cidade = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    pais = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    foto_perfil = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    criado_em = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    alterado_em = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    estado_conta = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    data_fim_suspensao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deletado_em = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.id_usuario);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "posts",
                columns: table => new
                {
                    IdPost = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Titulo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Resumo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Conteudo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TipoPostagem = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Categoria = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CategoriaEspecifica = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TipoEspecifico = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TiposIdTipo = table.Column<int>(type: "int", nullable: false),
                    CategoriasIdCategoria = table.Column<int>(type: "int", nullable: false),
                    UsuariosIdUsuario = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_posts", x => x.IdPost);
                    table.ForeignKey(
                        name: "FK_posts_categorias_CategoriasIdCategoria",
                        column: x => x.CategoriasIdCategoria,
                        principalTable: "categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_posts_tipos_TiposIdTipo",
                        column: x => x.TiposIdTipo,
                        principalTable: "tipos",
                        principalColumn: "id_tipo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_posts_usuarios_UsuariosIdUsuario",
                        column: x => x.UsuariosIdUsuario,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "seguidores",
                columns: table => new
                {
                    id_seguidor = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    id_usuario_seguidor = table.Column<int>(type: "int", nullable: false),
                    id_usuario_seguido = table.Column<int>(type: "int", nullable: false),
                    data_seguimento = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_seguidores", x => x.id_seguidor);
                    table.ForeignKey(
                        name: "FK_seguidores_usuarios_id_usuario_seguido",
                        column: x => x.id_usuario_seguido,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_seguidores_usuarios_id_usuario_seguidor",
                        column: x => x.id_usuario_seguidor,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "comentarios",
                columns: table => new
                {
                    IdComentario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Conteudo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CriadoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AlteradoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletadoEm = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comentarios", x => x.IdComentario);
                    table.ForeignKey(
                        name: "FK_comentarios_posts_PostId",
                        column: x => x.PostId,
                        principalTable: "posts",
                        principalColumn: "IdPost",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_comentarios_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "curtidas",
                columns: table => new
                {
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    AlteradoEm = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_curtidas", x => new { x.UsuarioId, x.PostId });
                    table.ForeignKey(
                        name: "FK_curtidas_posts_PostId",
                        column: x => x.PostId,
                        principalTable: "posts",
                        principalColumn: "IdPost",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_curtidas_usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "poststags",
                columns: table => new
                {
                    post_id = table.Column<int>(type: "int", nullable: false),
                    tag_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_poststags", x => new { x.post_id, x.tag_id });
                    table.ForeignKey(
                        name: "FK_poststags_posts_post_id",
                        column: x => x.post_id,
                        principalTable: "posts",
                        principalColumn: "IdPost",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_poststags_tags_tag_id",
                        column: x => x.tag_id,
                        principalTable: "tags",
                        principalColumn: "id_tag",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_comentarios_PostId",
                table: "comentarios",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_comentarios_UsuarioId",
                table: "comentarios",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_curtidas_PostId",
                table: "curtidas",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_posts_CategoriasIdCategoria",
                table: "posts",
                column: "CategoriasIdCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_posts_TiposIdTipo",
                table: "posts",
                column: "TiposIdTipo");

            migrationBuilder.CreateIndex(
                name: "IX_posts_UsuariosIdUsuario",
                table: "posts",
                column: "UsuariosIdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_poststags_tag_id",
                table: "poststags",
                column: "tag_id");

            migrationBuilder.CreateIndex(
                name: "IX_seguidores_id_usuario_seguido",
                table: "seguidores",
                column: "id_usuario_seguido");

            migrationBuilder.CreateIndex(
                name: "IX_seguidores_id_usuario_seguidor",
                table: "seguidores",
                column: "id_usuario_seguidor");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "comentarios");

            migrationBuilder.DropTable(
                name: "curtidas");

            migrationBuilder.DropTable(
                name: "poststags");

            migrationBuilder.DropTable(
                name: "seguidores");

            migrationBuilder.DropTable(
                name: "posts");

            migrationBuilder.DropTable(
                name: "tags");

            migrationBuilder.DropTable(
                name: "categorias");

            migrationBuilder.DropTable(
                name: "tipos");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
