import { jsPDF } from 'jspdf'
import { ElementBoundingBox, InvoiceDocData } from './models/internal.ts'
import { Invoice } from './models/input.ts'
import { getTextDimensions } from './utils.ts'

interface UpperDetailOptions {
    headerText: string
    dataText: string|string[]
    horizontalPlacement: 'left' | 'right'
    y: number
    dataTextAlignment: 'center' | 'left'
}

export function generateUpperDetails(
    doc: jsPDF,
    invoiceDocData: InvoiceDocData,
    invoice: Invoice,
): ElementBoundingBox {
    const separatorSpace = 5

    const issuePlaceRect = generateUpperDetail(
        doc,
        invoiceDocData,
        {
            headerText: invoiceDocData.upperDetails.placeOfIssueTitle,
            dataText: invoice.placeOfIssue,
            horizontalPlacement: 'right',
            y: invoiceDocData.margins.vertical,
            dataTextAlignment: 'center',
        },
    )

    const issueDateRect = generateUpperDetail(
        doc,
        invoiceDocData,
        {
            headerText: invoiceDocData.upperDetails.dateOfIssueTitle,
            dataText: invoice.dateOfIssue,
            horizontalPlacement: 'right',
            y: issuePlaceRect.y + issuePlaceRect.height + separatorSpace,
            dataTextAlignment: 'center',
        },
    )

    const buyerRect = generateUpperDetail(
        doc,
        invoiceDocData,
        {
            headerText: invoiceDocData.upperDetails.buyerTitle,
            dataText: [invoice.buyer.name, invoice.buyer.nip, invoice.buyer.address1, invoice.buyer.address2],
            horizontalPlacement: 'right',
            y: issueDateRect.y + issueDateRect.height + separatorSpace,
            dataTextAlignment: 'left',
        },
    )

    const issuerRect = generateUpperDetail(
        doc,
        invoiceDocData,
        {
            headerText: invoiceDocData.upperDetails.issuerTitle,
            dataText: [invoice.issuer.name, invoice.issuer.nip, invoice.issuer.address1, invoice.issuer.address2],
            horizontalPlacement: 'left',
            y: buyerRect.y,
            dataTextAlignment: 'left',
        },
    )

    return {
        x: issuerRect.x,
        y: issuePlaceRect.y,
        width: issuerRect.width + invoiceDocData.upperDetails.verticalSeparatorSpace + buyerRect.width,
        height: issuePlaceRect.height + issueDateRect.height + buyerRect.height + separatorSpace * 2,
    }
}

function generateUpperDetail(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    opts: UpperDetailOptions,
): ElementBoundingBox {
    const rectWidth =
        (docInfo.pageWidth - 2 * docInfo.margins.horizontal - docInfo.upperDetails.verticalSeparatorSpace) / 2
    const rectX = opts.horizontalPlacement === 'left'
        ? docInfo.margins.horizontal
        : docInfo.margins.horizontal + rectWidth + docInfo.upperDetails.verticalSeparatorSpace
    doc.setFontSize(12)
    doc.setFillColor(200, 200, 200)
    doc.setDrawColor(200, 200, 200)
    doc.rect(rectX, opts.y, rectWidth, docInfo.upperDetails.headerHeight, 'F')
    const headerTextDim = getTextDimensions(doc, opts.headerText)
    const headerTextX = rectX + (rectWidth - headerTextDim.totalWidth) / 2
    const headerTextY = opts.y + (headerTextDim.firstLineHeight / 3) +
        (docInfo.upperDetails.headerHeight / 2)
    doc.text(opts.headerText, headerTextX, headerTextY)
    doc.setDrawColor(0)
    doc.setLineWidth(0.25)
    doc.line(rectX, opts.y, rectX + rectWidth, opts.y)
    const dataTextDim = getTextDimensions(doc, opts.dataText)
    const dataTextX = opts.dataTextAlignment === 'center' ? rectX + (rectWidth - dataTextDim.totalWidth) / 2 : rectX + 1
    const dataTextY = opts.y + docInfo.upperDetails.headerHeight + dataTextDim.firstLineHeight + 1
    doc.text(opts.dataText, dataTextX, dataTextY)

    const result = {
        x: rectX,
        y: opts.y,
        height: docInfo.upperDetails.headerHeight + dataTextDim.totalHeight,
        width: rectWidth,
    }

    doc.line(0, result.y + result.height, docInfo.pageWidth, result.y + result.height)
    return result
}
