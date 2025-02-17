import { jsPDF } from 'jspdf'
import { ElementBoundingBox, InvoiceDocData } from './models/internal.ts'
import { Invoice } from './main.ts'
import { getTextSize } from './utils.ts'
import { Font } from './models/templateDefintion.ts'
import { setDrawing, setFont } from './models/extensions.ts'

export function generateBottomDetails(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    itemTableBoudningBox: ElementBoundingBox,
) {
    generateLeftDetails(doc, docInfo, invoice, itemTableBoudningBox)
}

function generateLeftDetails(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    itemTableBoudningBox: ElementBoundingBox,
) {
    const leftDetailsStartX = itemTableBoudningBox.x
    let startY = itemTableBoudningBox.y + itemTableBoudningBox.height + docInfo.bottomDetails.topMargin
    const sectionWidth = (docInfo.pageWidth - leftDetailsStartX * 2 - docInfo.bottomDetails.verticalSpace) / 2

    const elements: { title: string; value: string | string[] }[] = [
        { title: docInfo.bottomDetails.left.paymentMethodTitle, value: invoice.methodOfPayment },
        { title: docInfo.bottomDetails.left.paymentDeadlineTitle, value: invoice.paymentDeadline },
        { title: docInfo.bottomDetails.left.bankAccountNumberTitle, value: [invoice.bankAccount] },
        { title: docInfo.bottomDetails.left.bankNameTitle, value: [invoice.bankName] },
        { title: docInfo.bottomDetails.left.extraInfoTitle, value: invoice.extraInformation },
    ]

    elements.forEach((element) => {
        const elementBoundingBox = generateLeftDetail(
            doc,
            docInfo,
            leftDetailsStartX,
            startY,
            sectionWidth,
            element.title,
            element.value,
        )
        startY += elementBoundingBox.height
    })
}

function generateLeftDetail(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    startX: number,
    startY: number,
    width: number,
    title: string,
    value: string | string[],
): ElementBoundingBox {
    const textLeftMargin = 2
    const topMargin = 3
    
    //draw line
    const realStartY = startY + topMargin
    setDrawing(doc, docInfo.bottomDetails.drawing)
    doc.line(startX, realStartY, startX + width, realStartY)

    //draw text
    const titleStartX = startX + textLeftMargin
    const titleStartY = realStartY + topMargin 
    setFont(doc, docInfo.bottomDetails.left.titleFont)
    doc.text(title, titleStartX, titleStartY, {
        baseline: 'top',
        align: 'left',
    })

    const titleTextSize = getTextSize(doc, title)
    let totalHeight = docInfo.bottomDetails.drawing.lineWidth + topMargin + titleTextSize.height 

    setFont(doc, docInfo.bottomDetails.left.dataFont)
    if (typeof value === 'string') {
        const separator = 4
        doc.text(value, titleStartX + titleTextSize.width + separator, titleStartY, {
            baseline: 'top',
            align: 'left',
        })
    } else {
        const originalLineHeightFactor = doc.getLineHeightFactor()
        doc.setLineHeightFactor(1.4)
        const separator = 1 
        doc.setLineHeightFactor 
        doc.text(value, titleStartX, titleStartY + titleTextSize.height + separator, {
            baseline: 'top',
            align: 'left',
        })
        const textSize = getTextSize(doc, value)
        totalHeight += textSize.height + separator

        doc.setLineHeightFactor(originalLineHeightFactor)
    }

    return {
        x: startX, 
        y: startY,
        width: width,
        height: totalHeight
    }
}
