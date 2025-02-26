using System.ComponentModel.DataAnnotations;

namespace Server.Database;

public class InvoiceTemplate
{
    [Key]
    public int Id { get; set; }
    public Company Issuer { get; set; } = null!;
    public Company Buyer { get; set; } = null!;
    public string TitleTemplate {get; set;}=null!;
    public string PaymentMethod {get;set;}=null!;
    public string PlaceOfIssue {get;set;}=null!;
    public string BankAccount {get;set;}=null!;
    public string BankName{get;set;}=null!;
    public string ExtraInformation{get;set;}=null!;
    public InvoiceItemTemplate? InvoiceTemplateItem {get; set;} = null!;
}

