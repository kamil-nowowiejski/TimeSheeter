import { jsPDF } from 'jspdf'
import { ElementBoundingBox, InvoiceDocData } from './models/internal.ts'
import { Invoice } from './models/input.ts'
import { getTextSize } from './utils.ts'
import { setDrawing, setFont } from './models/extensions.ts'
import {  InvoiceTopDetailTemplate } from './models/templateDefintion.ts'

interface TopDetailsOptions {
    template: InvoiceTopDetailTemplate
    dataText: string | string[]
    horizontalPlacement: 'left' | 'right'
    y: number
    dataTextAlignment: 'center' | 'left'
}

export function generateTopDetails(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
): ElementBoundingBox {
    const separatorSpace = 5

    const issuePlaceRect = generateTopDetail(
        doc,
        docInfo,
        {
            template: docInfo.topDetails.place,
            dataText: invoice.placeOfIssue,
            horizontalPlacement: 'right',
            y: docInfo.margins.vertical,
            dataTextAlignment: 'center',
        },
    )

    const issueDateRect = generateTopDetail(
        doc,
        docInfo,
        {
            template: docInfo.topDetails.date,
            dataText: invoice.dateOfIssue,
            horizontalPlacement: 'right',
            y: issuePlaceRect.y + issuePlaceRect.height + separatorSpace,
            dataTextAlignment: 'center',
        },
    )

    const buyerRect = generateTopDetail(
        doc,
        docInfo,
        {
            template: docInfo.topDetails.buyer,
            dataText: [invoice.buyer.name, invoice.buyer.nip, invoice.buyer.address1, invoice.buyer.address2],
            horizontalPlacement: 'right',
            y: issueDateRect.y + issueDateRect.height + separatorSpace,
            dataTextAlignment: 'left',
        },
    )

    const issuerRect = generateTopDetail(
        doc,
        docInfo,
        {
            template: docInfo.topDetails.issuer,
            dataText: [invoice.issuer.name, invoice.issuer.nip, invoice.issuer.address1, invoice.issuer.address2],
            horizontalPlacement: 'left',
            y: buyerRect.y,
            dataTextAlignment: 'left',
        },
    )

    return {
        x: issuerRect.x,
        y: issuePlaceRect.y,
        width: issuerRect.width + docInfo.topDetails.verticalSpace + buyerRect.width,
        height: issuePlaceRect.height + issueDateRect.height + buyerRect.height + separatorSpace * 2,
    }
}

function generateTopDetail(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    opts: TopDetailsOptions,
): ElementBoundingBox {
    //draw header rectangle
    const rectWidth = (docInfo.pageWidth - 2 * docInfo.margins.horizontal - docInfo.topDetails.verticalSpace) / 2
    const rectX = opts.horizontalPlacement === 'left'
        ? docInfo.margins.horizontal
        : docInfo.margins.horizontal + rectWidth + docInfo.topDetails.verticalSpace

    setDrawing(doc, docInfo.topDetails.drawing)
    doc.rect(rectX, opts.y, rectWidth, opts.template.headerHeight, 'F')

    //draw line on the top border of header rectangle
    doc.line(rectX, opts.y, rectX + rectWidth, opts.y)

    //populate header text
    setFont(doc, opts.template.headerFont)
    const headerTextX = rectX + rectWidth / 2
    const headerTextY = opts.y + opts.template.headerHeight / 2
    doc.text(opts.template.title, headerTextX, headerTextY, {
        align: 'center',
        baseline: 'middle',
    })

    //populate data text
    setFont(doc, opts.template.dataFont)
    const dataTextSize = getTextSize(doc, opts.dataText)
    const dataTextX = opts.dataTextAlignment === 'center' ? rectX + rectWidth / 2 : rectX + 2
    const dataTextY = opts.y + opts.template.headerHeight + 1
    doc.text(opts.dataText, dataTextX, dataTextY, {
        align: opts.dataTextAlignment,
        baseline: 'top',
    })

    return {
        x: rectX,
        y: opts.y,
        height: opts.template.headerHeight + dataTextSize.height,
        width: rectWidth,
    }
}
