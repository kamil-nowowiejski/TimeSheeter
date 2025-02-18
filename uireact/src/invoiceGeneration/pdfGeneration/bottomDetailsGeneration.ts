import { jsPDF } from 'jspdf'
import { ElementBoundingBox, InvoiceDocData } from './models/internal.ts'
import { Invoice } from './main.ts'
import { getTextSize, toMoneyFormat } from './utils.ts'
import { setDrawing, setFont } from './models/extensions.ts'

export function generateBottomDetails(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    itemTableBoudningBox: ElementBoundingBox,
) {
    const leftBoundingBox = generateLeftDetails(doc, docInfo, invoice, itemTableBoudningBox)
    generateRighDetails(doc, docInfo, invoice, leftBoundingBox)
}

function generateLeftDetails(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    itemTableBoudningBox: ElementBoundingBox,
): ElementBoundingBox {
    const leftDetailsStartX = itemTableBoudningBox.x
    const sectionStartY = itemTableBoudningBox.y + itemTableBoudningBox.height + docInfo.bottomDetails.topMargin
    const sectionWidth = (docInfo.pageWidth - leftDetailsStartX * 2 - docInfo.bottomDetails.verticalSpace) / 2

    const elements: { title: string; value: string | string[] }[] = [
        { title: docInfo.bottomDetails.left.paymentMethodTitle, value: invoice.methodOfPayment },
        { title: docInfo.bottomDetails.left.paymentDeadlineTitle, value: invoice.paymentDeadline },
        { title: docInfo.bottomDetails.left.bankAccountNumberTitle, value: [invoice.bankAccount] },
        { title: docInfo.bottomDetails.left.bankNameTitle, value: [invoice.bankName] },
        { title: docInfo.bottomDetails.left.extraInfoTitle, value: invoice.extraInformation },
    ]

    let elementStartY = sectionStartY
    elements.forEach((element) => {
        const elementBoundingBox = generateLeftDetail(
            doc,
            docInfo,
            leftDetailsStartX,
            elementStartY,
            sectionWidth,
            element.title,
            element.value,
        )
        elementStartY += elementBoundingBox.height
    })

    return {
        x: leftDetailsStartX,
        y: sectionStartY,
        width: sectionWidth,
        height: elementStartY,
    }
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
        height: totalHeight,
    }
}

function generateRighDetails(
    doc: jsPDF,
    docInfo: InvoiceDocData,
    invoice: Invoice,
    leftBoundingBox: ElementBoundingBox,
) {
    const textLeftMargin = 2
    const topMargin = 3

    //draw line
    const startX = leftBoundingBox.x + leftBoundingBox.width + docInfo.bottomDetails.verticalSpace
    const startY = leftBoundingBox.y + topMargin
    const sectionWidth = leftBoundingBox.width
    setDrawing(doc, docInfo.bottomDetails.drawing)
    doc.line(startX, startY, startX + sectionWidth, startY)

    //populate total payment amount text
    setFont(doc, docInfo.bottomDetails.right.totalPaymentFont)

    const totalPaymentTitleX = startX + textLeftMargin
    const totalPaymentTitleY = startY + topMargin
    const totalAmountTitle = docInfo.bottomDetails.right.totalPaymentTitle
    doc.text(totalAmountTitle, totalPaymentTitleX, totalPaymentTitleY, {
        baseline: 'top',
        align: 'left',
    })

    const totalAmountTitleSize = getTextSize(doc, totalAmountTitle)

    const totalAmountText = toMoneyFormat(invoice.aggregate.grossValue, invoice.currency)
    const totalAmountSeparator = 2
    const totalAmountX = totalPaymentTitleX + totalAmountSeparator + totalAmountTitleSize.width
    const totalAmountY = totalPaymentTitleY
    doc.text(totalAmountText, totalAmountX, totalAmountY, {
        baseline: 'top',
        align: 'left',
    })

    //draw line
    const bottomLineStartY = totalPaymentTitleY + totalAmountTitleSize.height + docInfo.bottomDetails.drawing.lineWidth
    doc.line(startX, bottomLineStartY, startX + sectionWidth, bottomLineStartY)

    //populate in-words amount
    const grossValueInWordsTitle = docInfo.bottomDetails.right.inWordsTotalPaymentTitle
    setFont(doc, docInfo.bottomDetails.right.inWordsTotalPaymentFont)
    const inWordsTitleX = totalPaymentTitleX
    const inWordsTitleY = bottomLineStartY + docInfo.bottomDetails.drawing.lineWidth + topMargin
    doc.text(grossValueInWordsTitle, inWordsTitleX, inWordsTitleY, {
        baseline: 'top',
        align: 'left',
    })
    const inWordsSize = getTextSize(doc, grossValueInWordsTitle)
    const inWordsSeparator = 4

    const inWordsMaxSize = sectionWidth - inWordsSeparator - textLeftMargin * 2 - inWordsSize.width
    const grossValueInWords = doc.splitTextToSize(invoice.aggregate.grossValueInWords, inWordsMaxSize)
    const inWordsX = inWordsTitleX + inWordsSize.width + inWordsSeparator
    const inWordsY = inWordsTitleY
    doc.text(grossValueInWords, inWordsX, inWordsY, {
        baseline: 'top',
        align: 'left',
    })
}
