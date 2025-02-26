using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddEarningsAndInvoiceTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Nip = table.Column<string>(type: "TEXT", nullable: false),
                    Street = table.Column<string>(type: "TEXT", nullable: false),
                    City = table.Column<string>(type: "TEXT", nullable: false),
                    PostalCode = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Earnings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EarningsPerHour = table.Column<double>(type: "REAL", nullable: false),
                    Currency = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Earnings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IssuerId = table.Column<int>(type: "INTEGER", nullable: false),
                    BuyerId = table.Column<int>(type: "INTEGER", nullable: false),
                    TitleTemplate = table.Column<string>(type: "TEXT", nullable: false),
                    PaymentMethod = table.Column<string>(type: "TEXT", nullable: false),
                    PlaceOfIssue = table.Column<string>(type: "TEXT", nullable: false),
                    BankAccount = table.Column<string>(type: "TEXT", nullable: false),
                    BankName = table.Column<string>(type: "TEXT", nullable: false),
                    ExtraInformation = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceTemplates_Company_BuyerId",
                        column: x => x.BuyerId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InvoiceTemplates_Company_IssuerId",
                        column: x => x.IssuerId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTemplates_BuyerId",
                table: "InvoiceTemplates",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceTemplates_IssuerId",
                table: "InvoiceTemplates",
                column: "IssuerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Earnings");

            migrationBuilder.DropTable(
                name: "InvoiceTemplates");

            migrationBuilder.DropTable(
                name: "Company");
        }
    }
}
