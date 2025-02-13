import { jsPDF } from 'jspdf'
import { getTextDimensions } from './utils.ts'
import { ElementBoundingBox, InvoiceDocData } from './models/internal.ts'
import { Invoice } from './models/input.ts'

export function generateInvoiceTitle(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    upperDetailsRect: ElementBoundingBox,
): ElementBoundingBox {
    const verticalSeparator = 2.5
    const titleMessage = invoice.title
    const textDim = getTextDimensions(doc, titleMessage)
    const textX = (docInfo.pageWidth - 2 * docInfo.margins.horizontal - textDim.totalWidth) / 2
    const textY = upperDetailsRect.y + upperDetailsRect.height + textDim.firstLineHeight + verticalSeparator
    doc.setDrawColor(255, 0, 0)
    doc.line(0, upperDetailsRect.y + upperDetailsRect.height, 10000, upperDetailsRect.y + upperDetailsRect.height)

    doc.text(titleMessage, textX, textY)
    return {
        x: textX,
        y: textY,
        width: textDim.totalWidth,
        height: textDim.totalHeight,
    }
}
