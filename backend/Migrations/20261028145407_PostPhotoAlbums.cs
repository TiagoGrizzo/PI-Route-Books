using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Route_Books_api.Migrations
{
    /// <inheritdoc />
    public partial class PostPhotoAlbums : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagensJson",
                table: "posts",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagensJson",
                table: "posts");
        }
    }
}
