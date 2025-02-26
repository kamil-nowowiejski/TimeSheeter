using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Api.Dtos;
using Server.Database;

namespace Server.Api;

[ApiController]
[Route("api/InvoiceTemplate")]
public class InvoiceTemplateController(TimeSheeterDbContext dbContext) : ControllerBase
{
    private readonly TimeSheeterDbContext _dbContext = dbContext;

    [HttpGet]
    public InvoiceTemplateDto Get()
    {
        var invoiceTemplate = _dbContext.InvoiceTemplates
            .Include(x => x.Issuer)
            .Include(x => x.Buyer)
            .Include(x => x.InvoiceTemplateItem)
            .Single();

        return new InvoiceTemplateDto
        {
            Issuer = MapToDto(invoiceTemplate.Issuer),
            Buyer = MapToDto(invoiceTemplate.Buyer),
            TitleTemplate = invoiceTemplate.TitleTemplate,
            BankName = invoiceTemplate.BankName,
            BankAccount = invoiceTemplate.BankAccount,
            PlaceOfIssue = invoiceTemplate.PlaceOfIssue,
            PaymentMethod = invoiceTemplate.PaymentMethod,
            ExtraInformation = [.. invoiceTemplate.ExtraInformation.Split("\n")],
            InvoiceItemTemplate = MapToDto(invoiceTemplate.InvoiceTemplateItem!)
        };
    }

    private static CompanyDto MapToDto(Company company)
    {
        return new CompanyDto()
        {
            Name = company.Name,
            Street = company.Street,
            City = company.City,
            Nip = company.Nip,
            PostalCode = company.PostalCode
        };
    }

    private static InvoiceItemTemplateDto MapToDto(InvoiceItemTemplate model)
    {
        return new InvoiceItemTemplateDto()
        {
            Unit = model.Unit,
            Description = model.Description,
            VatRate = model.VatRate
        };
    }
}
