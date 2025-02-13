export class InvoiceTemplate {
    private _margins: Margins
    private _upperDetails: InvoiceUpperDetailsTemplate
    private _tableHeaders: TableHeader[]

    public get margins() {
        return this._margins
    }
    public get upperDetails() {
        return this._upperDetails
    }

    public get tableHeaders() {
        return this._tableHeaders
    }

    constructor() {
        this._margins = {
            horizontal: 5,
            vertical: 5,
        }

        this._upperDetails = {
            placeOfIssueTitle: 'Miejsce wystawienia',
            dateOfIssueTitle: 'Data wystawienia',
            issuerTitle: 'Sprzedawca',
            buyerTitle: 'Nabywca',
            verticalSeparatorSpace: 30,
            headerHeight: 7,
        }

        this._tableHeaders = [
            { text: 'Lp.', propotionalSize: 0.05 },
            { text: 'Nazwa towaru lub usługi', propotionalSize: 0.3 },
            { text: 'Jm.', propotionalSize: 0.06 },
            { text: 'Ilość', propotionalSize: 0.07 },
            { text: 'Cena netto', propotionalSize: 0.11 },
            { text: 'Wartość\n netto', propotionalSize: 0.11 },
            { text: 'Stawka\n VAT', propotionalSize: 0.08 },
            { text: 'Kwota VAT', propotionalSize: 0.11 },
            { text: 'Wartość\n brutto', propotionalSize: 0.11 },
        ]

        this.validateDefinedData()
    }

    private validateDefinedData() {
        const headersPropotionSum = this.tableHeaders.reduce((acc, val) => acc + val.propotionalSize, 0)
        if (Math.abs(1.0 - headersPropotionSum) > 0.001) {
            throw new Error(`Headers size does not add up to 1. Sum is equal to ${headersPropotionSum}`)
        }
    }
}

export interface Margins {
    horizontal: number
    vertical: number
}

export interface InvoiceUpperDetailsTemplate {
    placeOfIssueTitle: string
    dateOfIssueTitle: string
    issuerTitle: string
    buyerTitle: string
    verticalSeparatorSpace: number
    headerHeight: number
}

export interface TableHeader {
    text: string
    propotionalSize: number
}
