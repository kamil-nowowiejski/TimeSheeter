import { jsPDF } from 'jspdf'
import { InvoiceTemplate } from './models/templateDefintion.ts'
import { generateUpperDetails } from './upperDetailsGeneration.ts'
import { generateInvoiceTitle } from './invoiceTitleGeneration.ts'
import { generateItemsTable } from './invoiceTableGeneration.ts'
import { Invoice } from './models/input.ts'
import { InvoiceDocData } from './models/internal.ts'

export type { Invoice } from './models/input.ts'

export interface FontsProvider {
    getArialUnicodeMs: () => Promise<string>
}

export async function generateInvoice(invoice: Invoice, fileName: string, fonts: FontsProvider) {
    const doc = new jsPDF()
    await setupFonts(doc, fonts)

    const invoiceDocData = new InvoiceDocData({
        pageWidth:doc.internal.pageSize.getWidth(),
        invoiceTemplate: new InvoiceTemplate()
    })

    const upperDetailsRect = generateUpperDetails(doc, invoiceDocData, invoice)
    const invoiceTitleRect = generateInvoiceTitle(doc, invoiceDocData, invoice, upperDetailsRect)
    generateItemsTable(doc, invoiceDocData, invoice.items, invoiceTitleRect)

    doc.save(fileName)
}

async function setupFonts(doc: jsPDF, fonts: FontsProvider) {
    await fonts.getArialUnicodeMs()
        .then((content) => setupFont('arial-unicode-ms', content))
    doc.setFont('arial-unicode-ms')
    function setupFont(name: string, content: string) {
        const fileName = name + '.ttf'
        doc.addFileToVFS(fileName, content)
        doc.addFont(fileName, name, 'normal')
    }
}
