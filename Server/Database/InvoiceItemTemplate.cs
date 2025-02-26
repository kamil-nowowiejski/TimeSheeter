using System.ComponentModel.DataAnnotations;

namespace Server.Database;

public class InvoiceItemTemplate
{
    [Key]
    public int Id { get; set; }
    public string Description { get; set; } = null!;
    public string Unit { get; set; } = null!;
    public double VatRate { get; set; }
}
