export class InvoiceTemplate {
    private _margins: Margins
    private _topDetails: InvoiceTopDetailsTemplate
    private _invoiceTitle: InvoiceTitleTemplate
    private _invoiceItemsTable: InvoiceItemsTableTemplate
    private _bottomDetails: InvoiceBottomDetailsTemplate

    public get margins() {
        return this._margins
    }
    public get topDetails() {
        return this._topDetails
    }

    public get invoiceTitle() {
        return this._invoiceTitle
    }

    public get itemsTable() {
        return this._invoiceItemsTable
    }

    public get bottomDetails() {
        return this._bottomDetails
    }

    constructor() {
        this._margins = {
            horizontal: 10,
            vertical: 10,
        }

        this._topDetails = {
            date: {
                title: 'Data wystawienia',
                headerFont: { name: 'arial', style: 'regular', size: 11 },
                headerHeight: 6,
                dataFont: { name: 'arial', style: 'bold', size: 11 },
            },
            place: {
                title: 'Miejsce wystawienia',
                headerFont: { name: 'arial', style: 'regular', size: 11 },
                headerHeight: 6,
                dataFont: { name: 'arial', style: 'bold', size: 11 },
            },
            issuer: {
                title: 'Sprzedawca',
                headerFont: { name: 'arial', style: 'bold', size: 11 },
                headerHeight: 6,
                dataFont: { name: 'arial', style: 'regular', size: 11 },
            },
            buyer: {
                title: 'Nabywca',
                headerFont: { name: 'arial', style: 'bold', size: 11 },
                headerHeight: 6,
                dataFont: { name: 'arial', style: 'regular', size: 11 },
            },
            verticalSpace: 25,
            drawing: {
                fillColor: { r: 230, g: 230, b: 230 },
                lineColor: { r: 0, g: 0, b: 0 },
                lineWidth: 0.2,
            },
        }

        this._invoiceTitle = {
            topMargin: 8,
            bottomMargin: 1.5,
            font: {
                name: 'arial',
                size: 20,
                style: 'bold',
            },
        }

        this._invoiceItemsTable = {
            headers: [
                { text: 'Lp.', propotionalSize: 0.05 },
                { text: 'Nazwa towaru lub usługi', propotionalSize: 0.3 },
                { text: 'Jm.', propotionalSize: 0.06 },
                { text: 'Ilość', propotionalSize: 0.07 },
                { text: 'Cena netto', propotionalSize: 0.11 },
                { text: 'Wartość\n netto', propotionalSize: 0.11 },
                { text: 'Stawka\n VAT', propotionalSize: 0.08 },
                { text: 'Kwota VAT', propotionalSize: 0.11 },
                { text: 'Wartość\n brutto', propotionalSize: 0.11 },
            ],
            headersFont: {
                name: 'arial',
                size: 10,
                style: 'bold',
            },
            dataFont: {
                name: 'arial',
                size: 10,
                style: 'regular',
            },
            drawing: {
                fillColor: { r: 230, g: 230, b: 230 },
                lineColor: { r: 100, g: 100, b: 100 },
                lineWidth: 0.3,
            },
            aggregate: {
                includingTitle: 'W tym',
                includingFont: { name: 'arial', size: 11, style: 'bold' },
                totalTitle: 'Razem',
                totalFont: { name: 'arial', size: 11, style: 'bold' },
            },
        }

        this._bottomDetails = {
            left: {
                paymentMethodTitle: 'Sposób płatności',
                paymentDeadlineTitle: 'Termin płatności',
                bankAccountNumberTitle: 'Numer konta',
                bankNameTitle: 'Nazwa banku',
                extraInfoTitle: 'Dodatkowe informacje',
                titleFont: {
                    name: 'arial',
                    size: 12,
                    style: 'bold',
                },
                dataFont: {
                    name: 'arial',
                    size: 12,
                    style: 'regular',
                },
            },
            right: {
                totalPaymentTitle: 'Do zapłaty',
                totalPaymentFont: {
                    name: 'arial',
                    size: 12,
                    style: 'bold',
                },

                inWordsTotalPaymentTitle: 'Słownie',
                inWordsTotalPaymentFont: {
                    name: 'arial',
                    size: 12,
                    style: 'regular',
                },
            },
            topMargin: 7,
            verticalSpace: 10,
            drawing: {
                fillColor: { r: 230, g: 230, b: 230 },
                lineColor: { r: 100, g: 100, b: 100 },
                lineWidth: 0.3,
            }
        }

        this.validateDefinedData()
    }

    private validateDefinedData() {
        const headersPropotionSum = this.itemsTable.headers.reduce((acc, val) => acc + val.propotionalSize, 0)
        if (Math.abs(1.0 - headersPropotionSum) > 0.001) {
            throw new Error(`Headers size does not add up to 1. Sum is equal to ${headersPropotionSum}`)
        }
    }
}

export interface Margins {
    horizontal: number
    vertical: number
}

type FontStyle = 'regular' | 'bold'

export interface InvoiceTopDetailsTemplate {
    place: InvoiceTopDetailTemplate
    date: InvoiceTopDetailTemplate
    buyer: InvoiceTopDetailTemplate
    issuer: InvoiceTopDetailTemplate
    verticalSpace: number
    drawing: Drawing
}

export interface InvoiceTopDetailTemplate {
    title: string
    headerFont: Font
    headerHeight: number
    dataFont: Font
}

export interface InvoiceTitleTemplate {
    bottomMargin: number
    topMargin: number
    font: Font
}

export interface InvoiceItemsTableTemplate {
    headers: InvoiceItemsTableHeader[]
    headersFont: Font
    dataFont: Font
    drawing: Drawing
    aggregate: InvoiceItemsTableAggregate
}

export interface InvoiceItemsTableHeader {
    text: string
    propotionalSize: number
}

export interface InvoiceItemsTableAggregate {
    includingTitle: string
    includingFont: Font
    totalTitle: string
    totalFont: Font
}

export interface InvoiceBottomDetailsTemplate {
    left: InvoiceBottomLeftDetailsTemplate
    right: InvoiceBottomRightDetailsTemplate
    topMargin: number
    verticalSpace: number
    drawing: Drawing
}

export interface InvoiceBottomLeftDetailsTemplate {
    paymentMethodTitle: string
    paymentDeadlineTitle: string
    bankAccountNumberTitle: string
    bankNameTitle: string
    extraInfoTitle: string
    titleFont: Font
    dataFont: Font
}

export interface InvoiceBottomRightDetailsTemplate {
    totalPaymentTitle: string
    totalPaymentFont: Font
    inWordsTotalPaymentTitle: string
    inWordsTotalPaymentFont: Font
}

export interface Font {
    name: string
    size: number
    style: FontStyle
}

export interface Color {
    r: number
    g: number
    b: number
}

export interface Drawing {
    fillColor: Color
    lineColor: Color
    lineWidth: number
}
