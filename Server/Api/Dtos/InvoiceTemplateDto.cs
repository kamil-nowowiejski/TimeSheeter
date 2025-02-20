namespace Server.Api.Dtos;

public class InvoiceTemplateDto
{
    public string TitleTemplate { get; set; }=null!;
    public CompanyDto Issuer { get; set; }=null!;
    public CompanyDto Buyer { get; set; }=null!;
    public string PaymentMethod {get;set;}=null!;
    public string PlaceOfIssue {get;set;}=null!;
    public string BankAccount {get;set;}=null!;
    public string BankName{get;set;}=null!;
    public List<string> ExtraInformation{get;set;}=null!;
}

public class CompanyDto
{
    public string Name { get; set; }=null!;
    public string Nip { get; set; }=null!;
    public string Street { get; set; }=null!;
    public string City{ get; set; }=null!;
    public string PostalCode{ get; set; }=null!;
}
