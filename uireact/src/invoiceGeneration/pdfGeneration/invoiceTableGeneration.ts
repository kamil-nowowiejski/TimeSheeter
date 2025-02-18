import { jsPDF } from 'jspdf'
import { ElementBoundingBox, InvoiceDocData, TableHeader } from './models/internal.ts'
import { Invoice, InvoiceAggregate, InvoiceItem } from './models/input.ts'
import { getTextSize, TextSize, toMoneyFormat, toPercentage } from './utils.ts'
import { setDrawing, setFont } from './models/extensions.ts'
import { Font } from './models/templateDefintion.ts'

export function generateItemsTable(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    invoiceTitleBoundingBox: ElementBoundingBox,
) : ElementBoundingBox{
    const headersBoundingBox = generateItemsTableHeaders(doc, docInfo, invoiceTitleBoundingBox)
    const itemsBoundingBox = generateItems(doc, docInfo, headersBoundingBox, invoice.items)
    const aggregateBoundingBox = generateAggregate(doc, docInfo, itemsBoundingBox, invoice.aggregate)
    return {
        x: headersBoundingBox.x,
        y: headersBoundingBox.y,
        width: headersBoundingBox.width,
        height: headersBoundingBox.height + itemsBoundingBox.height + aggregateBoundingBox.height
    }
}

function generateItemsTableHeaders(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoiceTitleBoundingBox: ElementBoundingBox,
): ElementBoundingBox {
    //define table boundaries
    const startX = docInfo.margins.horizontal
    const finishX = docInfo.pageWidth - docInfo.margins.horizontal
    const tableWidth = finishX - startX
    const verticalSpace = 1
    const y = invoiceTitleBoundingBox.y + invoiceTitleBoundingBox.height + verticalSpace

    //calculate header row height
    const tableHeaderHeight = getTextSize(doc, docInfo.itemsTable.headers[0].text).height * 1.1
    setDrawing(doc, docInfo.itemsTable.drawing)
    doc.rect(startX, y, tableWidth, tableHeaderHeight, 'DF')

    //draw vertical lines
    let verticalLineX = startX
    const verticalLineStartY = y
    const verticalLineFinishY = y + tableHeaderHeight
    doc.line(verticalLineX, verticalLineStartY, verticalLineX, verticalLineFinishY)

    docInfo.itemsTable.headers.forEach((header) => {
        verticalLineX = verticalLineX + header.size
        doc.line(verticalLineX, verticalLineStartY, verticalLineX, verticalLineFinishY)
    })

    //populate text
    setFont(doc, docInfo.itemsTable.headersFont)
    let textBoundryLeft = startX
    docInfo.itemsTable.headers.forEach((header) => {
        const textBoundryRight = textBoundryLeft + header.size
        const possibleTextWidth = textBoundryRight - textBoundryLeft

        const textY = y + (tableHeaderHeight - getTextSize(doc, header.text).height) / 2 + 1
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
): ElementBoundingBox {
    let totalHeight = 0
    let previousItemRect = headersRect
    invoiceItems.forEach((item) => {
        previousItemRect = generateItem(doc, invoiceDocData, item, previousItemRect)
        totalHeight += previousItemRect.height
    })

    return {
        x: headersRect.x,
        y: headersRect.y + headersRect.height,
        width: previousItemRect.width,
        height: totalHeight,
    }
}

function generateItem(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    item: InvoiceItem,
    previousItemRect: ElementBoundingBox,
): ElementBoundingBox {
    let takenSpace = previousItemRect.x
    const items: InvoiceItemData[] = [
        { header: docInfo.itemsTable.headers[0], text: item.key.toString() },
        { header: docInfo.itemsTable.headers[1], text: item.description, leftAlign: true },
        { header: docInfo.itemsTable.headers[2], text: item.unit },
        { header: docInfo.itemsTable.headers[3], text: item.amount.toString() },
        { header: docInfo.itemsTable.headers[4], text: toMoneyFormat(item.netPrice) },
        { header: docInfo.itemsTable.headers[5], text: toMoneyFormat(item.netValue) },
        { header: docInfo.itemsTable.headers[6], text: toPercentage(item.vatRate) },
        { header: docInfo.itemsTable.headers[7], text: toMoneyFormat(item.vatValue) },
        { header: docInfo.itemsTable.headers[8], text: toMoneyFormat(item.grossValue) },
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

    const maxHeight = Math.max(...items.map((x) => x.textDimensions.height)) + 2

    //populate text
    setFont(doc, docInfo.itemsTable.dataFont)
    items.forEach((item) => {
        const textX = item.textAlign === 'center'
            ? item.boundries.left + (item.maxWidth / 2)
            : item.boundries.left + item.maxWidth * 0.03

        const textY = previousItemRect.y + previousItemRect.height + 1 +
            (maxHeight - item.textDimensions.height) / 2

        doc.text(item.splitText, textX, textY, {
            align: item.textAlign,
            baseline: 'top',
            maxWidth: item.maxWidth,
        })
    })

    //draw rectangles
    setDrawing(doc, docInfo.itemsTable.drawing)
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

class InvoiceItemData {
    private _splitText: string[]
    private _textDimensions: TextSize
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
        this._textDimensions = getTextSize(doc, this._splitText)
        this._boundries = data.boundries
        this._textAlign = data.textAlign
    }
}

function generateAggregate(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    itemsBoundingBox: ElementBoundingBox,
    invoiceAggregate: InvoiceAggregate,
) : ElementBoundingBox{
    //generate including row
    const netPriceLeftBorder = docInfo.itemsTable.headers
        .slice(0, 4)
        .reduce((acc, cur) => acc + cur.size, itemsBoundingBox.x)
    const includingRowStartY = itemsBoundingBox.y + itemsBoundingBox.height
    const includingRowBoundingBox = generateAggregateRow(
        doc,
        docInfo,
        netPriceLeftBorder,
        includingRowStartY,
        invoiceAggregate,
        (docInfo) => docInfo.itemsTable.aggregate.includingTitle,
        (vatRate) => toPercentage(vatRate),
        docInfo => docInfo.itemsTable.aggregate.includingFont
    )

    //generate total row
    const totalRowBoundingBox = generateAggregateRow(
        doc,
        docInfo,
        netPriceLeftBorder,
        includingRowBoundingBox.y + includingRowBoundingBox.height,
        invoiceAggregate,
        (docInfo) => docInfo.itemsTable.aggregate.totalTitle,
        () => '',
        docInfo => docInfo.itemsTable.aggregate.totalFont
    )
    return {
        x: netPriceLeftBorder, 
        y: includingRowStartY, 
        width: includingRowBoundingBox.width,
        height: includingRowBoundingBox.height + totalRowBoundingBox.height
    }
}

function generateAggregateRow(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    startX: number,
    startY: number,
    invoiceAggregate: InvoiceAggregate,
    getTitle: (docInfo: InvoiceDocData) => string,
    formatVatRate: (v: number) => string,
    getFont: (docInfo: InvoiceDocData) => Font,

) : ElementBoundingBox {
    //populate text
    const includingText = getTitle(docInfo)
    const netPriceHeader = docInfo.itemsTable.headers[4]
    const textSize = getTextSize(doc, includingText)
    const rowHeight = textSize.height + 2

    const textX = startX + netPriceHeader.size / 2
    const textY = startY + rowHeight / 2
    setFont(doc, getFont(docInfo))
    doc.text(includingText, textX, textY, {
        align: 'center',
        baseline: 'middle',
    })

    //prepare elements
    const elementsToDraw = []
    let leftBorder = startX + docInfo.itemsTable.headers[4].size
    for (let headerIndex = 5; headerIndex < docInfo.itemsTable.headers.length; headerIndex++) {
        let text = ''
        switch (headerIndex) {
            case 5:
                text = toMoneyFormat(invoiceAggregate.netValue)
                break
            case 6:
                text = formatVatRate(invoiceAggregate.vatRate)
                break
            case 7:
                text = toMoneyFormat(invoiceAggregate.vatValue)
                break
            case 8:
                text = toMoneyFormat(invoiceAggregate.grossValue)
                break
        }

        const element = {
            leftBorder: leftBorder,
            rightBorder: leftBorder + docInfo.itemsTable.headers[headerIndex].size,
            text: text,
            textSize: getTextSize(doc, text),
        }

        leftBorder = element.rightBorder

        elementsToDraw.push(element)
    }

    //draw elements
    setFont(doc, docInfo.itemsTable.dataFont)
    elementsToDraw.forEach((element) => {
        const width = element.rightBorder - element.leftBorder
        doc.rect(element.leftBorder, startY, width, rowHeight, 'S')
        const textX = element.leftBorder + width / 2
        const textY = startY + rowHeight / 2
        doc.text(element.text, textX, textY, {
            align: 'center',
            baseline: 'middle',
        })
    })

    const totalWidth = startX + docInfo.itemsTable.headers.slice(4).reduce((acc, cur) => acc + cur.size, 0)
    return {
        x: startX,
        y: startY,
        width: totalWidth,
        height: rowHeight,
    }
}
