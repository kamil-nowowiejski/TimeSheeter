import { jsPDF } from 'jspdf'
import { InvoiceTemplate } from './models/templateDefintion.ts'
import { generateTopDetails } from './topDetailsGeneration.ts'
import { generateInvoiceTitle } from './invoiceTitleGeneration.ts'
import { generateItemsTable } from './invoiceTableGeneration.ts'
import { Invoice } from './models/input.ts'
import { InvoiceDocData } from './models/internal.ts'

export type { Invoice } from './models/input.ts'

export interface FontsProvider {
    getFontRegular: () => Promise<string>
    getFontBold: () => Promise<string>
}

export async function generateInvoice(invoice: Invoice, fileName: string, fonts: FontsProvider) {
    const doc = new jsPDF()
    await setupFonts(doc, fonts)

    const invoiceDocData = new InvoiceDocData({
        pageWidth: doc.internal.pageSize.getWidth(),
        invoiceTemplate: new InvoiceTemplate(),
    })

    const upperDetailsRect = generateTopDetails(doc, invoiceDocData, invoice)
    const invoiceTitleRect = generateInvoiceTitle(doc, invoiceDocData, invoice, upperDetailsRect)
    generateItemsTable(doc, invoiceDocData, invoice, invoiceTitleRect)

    doc.save(fileName)
}

async function setupFonts(doc: jsPDF, fonts: FontsProvider) {
    await fonts.getFontRegular()
        .then((content) => setupFont('arial', content, 'regular'))

    await fonts.getFontBold()
        .then((content) => setupFont('arial', content, 'bold'))

    doc.setFont('arial', 'regular')
    
    function setupFont(name: string, content: string, style: string) {
        const fileName = name + style + '.ttf'
        doc.addFileToVFS(fileName, content)
        doc.addFont(fileName, name, style)
    }
}
