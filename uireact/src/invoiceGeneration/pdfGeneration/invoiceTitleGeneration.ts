import { jsPDF } from 'jspdf'
import { getTextSize } from './utils.ts'
import { ElementBoundingBox, InvoiceDocData } from './models/internal.ts'
import { Invoice } from './models/input.ts'
import { setFont } from './models/extensions.ts'

export function generateInvoiceTitle(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    upperDetailsRect: ElementBoundingBox,
): ElementBoundingBox {
    setFont(doc, docInfo.title.font)
    const titleMessage = invoice.title
    const textSize = getTextSize(doc, titleMessage)
    const textX = docInfo.pageWidth / 2
    const textY = upperDetailsRect.y + upperDetailsRect.height + docInfo.title.topMargin

    doc.text(titleMessage, textX, textY, {
        align: 'center',
        baseline: 'top',
    })
    return {
        x: textX,
        y: textY,
        width: textSize.width,
        height: textSize.height + docInfo.title.bottomMargin,
    }
}
