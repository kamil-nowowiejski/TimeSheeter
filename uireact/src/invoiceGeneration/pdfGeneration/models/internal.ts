import {
Drawing,
    Font,
    InvoiceItemsTableAggregate,
    InvoiceTemplate,
    InvoiceTitleTemplate,
    InvoiceTopDetailsTemplate,
    Margins,
    InvoiceItemsTableHeader as TableTemplateHeader,
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
    private _invoiceTopDetails: InvoiceTopDetailsTemplate
    private _invoiceTitle: InvoiceTitleTemplate
    private _invoiceItemsTable: InvoiceItemsTableTemplate

    public get pageWidth() {
        return this._pageWidth
    }

    public get margins() {
        return this._margins
    }

    public get topDetails() {
        return this._invoiceTopDetails
    }

    public get title() {
        return this._invoiceTitle
    }

    public get itemsTable() {
        return this._invoiceItemsTable
    }

    constructor(data: {
        pageWidth: number
        invoiceTemplate: InvoiceTemplate
    }) {
        this._pageWidth = data.pageWidth
        this._margins = data.invoiceTemplate.margins
        this._invoiceTopDetails = data.invoiceTemplate.upperDetails
        this._invoiceTitle = data.invoiceTemplate.invoiceTitle
        this._invoiceItemsTable = {
            headers: this.calculateTableHeadersSize(data.invoiceTemplate.itemsTable.headers),
            headersFont: data.invoiceTemplate.itemsTable.headersFont,
            dataFont: data.invoiceTemplate.itemsTable.dataFont,
            drawing: data.invoiceTemplate.itemsTable.drawing,
            aggregate: data.invoiceTemplate.itemsTable.aggregate
        }
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

export interface InvoiceItemsTableTemplate {
    headers: TableHeader[]
    headersFont: Font
    dataFont: Font
    drawing: Drawing
    aggregate: InvoiceItemsTableAggregate
}

export interface TableHeader {
    text: string
    size: number
}
