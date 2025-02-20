using System.ComponentModel.DataAnnotations;

namespace Server.Database;

public class Company
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Nip { get; set; }=null!;
    public string Street { get; set; }=null!;
    public string City{ get; set; }=null!;
    public string PostalCode{ get; set; }=null!;
}

