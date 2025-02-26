using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddInvoiceItemTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InvoiceTemplateItemId",
                table: "InvoiceTemplates",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InvoiceItemTemplate",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", nullable: false),
                    VatRate = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceItemTemplate", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTemplates_InvoiceTemplateItemId",
                table: "InvoiceTemplates",
                column: "InvoiceTemplateItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceTemplates_InvoiceItemTemplate_InvoiceTemplateItemId",
                table: "InvoiceTemplates",
                column: "InvoiceTemplateItemId",
                principalTable: "InvoiceItemTemplate",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceTemplates_InvoiceItemTemplate_InvoiceTemplateItemId",
                table: "InvoiceTemplates");

            migrationBuilder.DropTable(
                name: "InvoiceItemTemplate");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceTemplates_InvoiceTemplateItemId",
                table: "InvoiceTemplates");

            migrationBuilder.DropColumn(
                name: "InvoiceTemplateItemId",
                table: "InvoiceTemplates");
        }
    }
}
