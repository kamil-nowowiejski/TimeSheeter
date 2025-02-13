import {
    InvoiceTemplate,
    InvoiceUpperDetailsTemplate,
    Margins,
    TableHeader as TableTemplateHeader,
} from './templateDefintion.ts'

export interface ElementBoundingBox {
    x: number
    y: number
    width: number
    height: number
}

export class InvoiceDocData {
    private _pageWidth: number
    private _margins: Margins
    private _upperDetails: InvoiceUpperDetailsTemplate
    private _tableHeaders: TableHeader[]

    public get pageWidth() {
        return this._pageWidth
    }

    public get margins() {
        return this._margins
    }

    public get upperDetails() {
        return this._upperDetails
    }

    public get tableHeaders() {
        return this._tableHeaders
    }

    constructor(data: {
        pageWidth: number
        invoiceTemplate: InvoiceTemplate
    }) {
        this._pageWidth = data.pageWidth
        this._margins = data.invoiceTemplate.margins
        this._upperDetails = data.invoiceTemplate.upperDetails
        this._tableHeaders = this.calculateTableHeadersSize(data.invoiceTemplate.tableHeaders)
    }

    private calculateTableHeadersSize(tableHeaders: TableTemplateHeader[]): TableHeader[] {
        const tableWidth = this.pageWidth - 2 * this.margins.horizontal
        return tableHeaders.map((h) => {
            return {
                text: h.text,
                size: tableWidth * h.propotionalSize,
            }
        })
    }
}

export interface TableHeader {
    text: string
    size: number
}
