import { jsPDF } from 'jspdf'
import { ElementBoundingBox, InvoiceDocData, TableHeader } from './models/internal.ts'
import { InvoiceItem } from './models/input.ts'
import { getTextDimensions, TextDimensions } from './utils.ts'

export function generateItemsTable(
    doc: jsPDF,
    invoiceDocData: InvoiceDocData,
    invoiceItems: InvoiceItem[],
    invoiceTitleBoundingBox: ElementBoundingBox,
) {
    const headersBoundingBox = generateItemsTableHeaders(doc, invoiceDocData, invoiceTitleBoundingBox)
    generateItems(doc, invoiceDocData, headersBoundingBox, invoiceItems)
}

function generateItemsTableHeaders(
    doc: jsPDF,
    invoiceDocData: InvoiceDocData,
    invoiceTitleBoundingBox: ElementBoundingBox,
): ElementBoundingBox {
    //define table boundaries
    const startX = invoiceDocData.margins.horizontal
    const finishX = invoiceDocData.pageWidth - invoiceDocData.margins.horizontal
    const tableWidth = finishX - startX
    const verticalSpace = 1
    const y = invoiceTitleBoundingBox.y + invoiceTitleBoundingBox.height + verticalSpace

    //calculate header row height
    const tableHeaderHeight = getTextDimensions(doc, invoiceDocData.tableHeaders[0].text).totalHeight * 1.5
    doc.setFillColor(200, 200, 200)
    doc.setDrawColor(0, 0, 0)
    doc.rect(startX, y, tableWidth, tableHeaderHeight, 'FD')

    //draw vertical lines
    let verticalLineX = startX
    const verticalLineStartY = y
    const verticalLineFinishY = y + tableHeaderHeight
    doc.line(verticalLineX, verticalLineStartY, verticalLineX, verticalLineFinishY)

    invoiceDocData.tableHeaders.forEach((header) => {
        verticalLineX = verticalLineX + header.size
        doc.line(verticalLineX, verticalLineStartY, verticalLineX, verticalLineFinishY)
    })

    //populate text
    doc.setFontSize(10)
    let textBoundryLeft = startX
    invoiceDocData.tableHeaders.forEach((header) => {
        const textBoundryRight = textBoundryLeft + header.size
        const possibleTextWidth = textBoundryRight - textBoundryLeft

        const textY = y + (tableHeaderHeight - getTextDimensions(doc, header.text).totalHeight) / 2 + 1
        const textSplit = doc.splitTextToSize(header.text, possibleTextWidth)
        doc.text(textSplit, textBoundryLeft + possibleTextWidth / 2, textY, {
            align: 'center',
            baseline: 'top',
            maxWidth: possibleTextWidth,
        })

        textBoundryLeft = textBoundryRight
    })

    return {
        x: startX,
        y: y,
        width: tableWidth,
        height: tableHeaderHeight,
    }
}

function generateItems(
    doc: jsPDF,
    invoiceDocData: InvoiceDocData,
    headersRect: ElementBoundingBox,
    invoiceItems: InvoiceItem[],
) {
    let previousItemRect = headersRect
    invoiceItems.forEach((item) => {
        previousItemRect = generateItem(doc, invoiceDocData, item, previousItemRect)
    })
}

function generateItem(
    doc: jsPDF,
    invoiceDocData: InvoiceDocData,
    item: InvoiceItem,
    previousItemRect: ElementBoundingBox,
): ElementBoundingBox {
    let takenSpace = previousItemRect.x
    const items: InvoiceItemData[] = [
        { header: invoiceDocData.tableHeaders[0], text: item.key.toString() },
        { header: invoiceDocData.tableHeaders[1], text: item.description, leftAlign: true },
        { header: invoiceDocData.tableHeaders[2], text: item.unit },
        { header: invoiceDocData.tableHeaders[3], text: item.amount.toString() },
        { header: invoiceDocData.tableHeaders[4], text: toMoneyFormat(item.netPrice) },
        { header: invoiceDocData.tableHeaders[5], text: toMoneyFormat(item.netValue) },
        { header: invoiceDocData.tableHeaders[6], text: toPercentage(item.vatRate) },
        { header: invoiceDocData.tableHeaders[7], text: toMoneyFormat(item.vatValue) },
        { header: invoiceDocData.tableHeaders[8], text: toMoneyFormat(item.grossValue) },
    ].map((x) =>
        new InvoiceItemData(doc, {
            header: x.header,
            text: x.text,
            textAlign: x.leftAlign ? 'left' : 'center',
            boundries: {
                left: takenSpace,
                right: takenSpace += x.header.size,
            },
        })
    )

    const maxHeight = Math.max(...items.map((x) => x.textDimensions.totalHeight))

    //populate text
    items.forEach((item) => {
        const textX = item.textAlign === 'center'
            ? item.boundries.left + (item.maxWidth / 2)
            : item.boundries.left + item.maxWidth * 0.03

        const textY = previousItemRect.y + previousItemRect.height + 1 +
            (maxHeight - item.textDimensions.totalHeight) / 2

        doc.text(item.splitText, textX, textY, {
            align: item.textAlign,
            baseline: 'top',
            maxWidth: item.maxWidth,
        })
    })

    //draw rectangles
    doc.setDrawColor(0, 0, 0)
    items.forEach((item) => {
        const startX = item.boundries.left
        const startY = previousItemRect.y + previousItemRect.height
        doc.rect(startX, startY, item.maxWidth, maxHeight)
    })

    return {
        x: previousItemRect.x,
        y: previousItemRect.y + previousItemRect.height,
        width: previousItemRect.width,
        height: maxHeight,
    }
}

function genearateTableAggregate(
    doc: jsPDF,
    invoiceItems: InvoiceItem[],
    tableHeaders: TableHeader[],
    lastRowRect: ElementBoundingBox,
): ElementBoundingBox {
    const headers = tableHeaders.slice(4)
}
function toMoneyFormat(n: number) {
    return new Intl
        .NumberFormat('pl-PL', { minimumFractionDigits: 2, useGrouping: true })
        .format(n)
}

function toPercentage(n: number) {
    return new Intl
        .NumberFormat('pl-PL', { maximumFractionDigits: 0, useGrouping: true, style: 'percent' })
        .format(n)
}
class InvoiceItemData {
    private _splitText: string[]
    private _textDimensions: TextDimensions
    private _boundries: { left: number; right: number }
    private _textAlign: 'left' | 'center'

    public get splitText() {
        return this._splitText
    }

    public get textDimensions() {
        return this._textDimensions
    }

    public get boundries(): { left: number; right: number } {
        return this._boundries
    }

    public get textAlign() {
        return this._textAlign
    }

    public get maxWidth() {
        return this.boundries.right - this.boundries.left
    }

    constructor(
        doc: jsPDF,
        data: {
            header: TableHeader
            text: string
            textAlign: 'left' | 'center'
            boundries: { left: number; right: number }
        },
    ) {
        this._splitText = doc.splitTextToSize(data.text, data.header.size)
        this._textDimensions = getTextDimensions(doc, this._splitText)
        this._boundries = data.boundries
        this._textAlign = data.textAlign
    }
}
