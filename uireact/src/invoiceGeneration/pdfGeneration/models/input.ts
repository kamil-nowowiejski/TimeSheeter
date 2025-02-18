export interface Invoice {
    title: string
    placeOfIssue: string
    dateOfIssue: string
    issuer: Company
    buyer: Company
    items: InvoiceItem[]
    aggregate: InvoiceAggregate,
    methodOfPayment: string
    paymentDeadline: string
    bankAccount: string
    bankName: string
    extraInformation: string[]
    currency: string
}

export interface InvoiceItem {
    key: number
    description: string
    unit: string
    amount: number
    netPrice: number
    netValue: number
    vatRate: number
    vatValue: number
    grossValue: number
}

export interface InvoiceAggregate{
    netValue: number
    vatRate: number
    vatValue: number
    grossValue: number
    grossValueInWords: string
}

export interface Company{
    name: string
    nip: string
    address1: string
    address2: string
}
