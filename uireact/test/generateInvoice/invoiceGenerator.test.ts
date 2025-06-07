import { FontsProvider, generateInvoice, Invoice } from '../../src/invoiceGeneration/pdfGeneration/main.ts'

Deno.test('generate example invoice', async () => {
    const fileName = 'C:\\Users\\qrp\\Downloads\\test-invoice.pdf'
    removeExistingTestInvoiceFile(fileName)
    const testInvoice = getTestInvoice()
    await generateInvoice(testInvoice, fileName, new TestFontsProvider())
})

function removeExistingTestInvoiceFile(fileName: string) {
    try {
        Deno.removeSync(fileName)
    } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
            throw error
        }
    }
}

class TestFontsProvider implements FontsProvider {
    getFontRegular() {
        return this.getFont('arial.ttf')
    }

    getFontBold() {
        return this.getFont('arialbd.ttf')
    }

    async getFont(fileName: string) {
        const content = await Deno.readFile(`../Server/wwwroot/fonts/${fileName}`)
        return this.arrayBufferToBase64(content)
    }

    private arrayBufferToBase64(bytes: Uint8Array): string {
        let binary = ''
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return globalThis.btoa(binary)
    }
}

function getTestInvoice(): Invoice {
    const exampleItem = {
        key: 1,
        description: 'Umowa nr 1/2026 na swiadczenie uslugi od dnia 22.22.2222 do dnia 22.22.2222',
        unit: 'h',
        amount: 160,
        netPrice: 22400,
        netValue: 22400,
        vatRate: 0.23,
        vatValue: 5152,
        grossValue: 25555,
    }
    const items = [exampleItem, exampleItem, exampleItem]

    return {
        title: 'Faktura VAT 01/02/2024',
        placeOfIssue: 'Wrocław',
        dateOfIssue: '30-05-3333',
        finishDate: '29-05-3433',
        issuer: {
            name: 'STEFAN BATORY COOL COMPANY',
            nip: '123456789',
            address1: 'ul. Ćwiartki 3/4',
            address2: '12-345 Wrocław',
        },
        buyer: {
            name: 'Bolesław Chrobry CORP',
            nip: '987654321',
            address1: 'ul. Sezamkowa 34',
            address2: '54-535 Warszawa',
        },
        items: items,
        aggregate: {
            netValue: 23520,
            vatRate: 0.23,
            vatValue: 5402.6,
            grossValue: 28929.6,
            grossValueInWords: 'dwadzieścia osiem tysięcy dziewięćset dwadzieścia dziewięć 60/100 PLN',
        },
        methodOfPayment: 'przelew',
        paymentDeadline: '30-03-4443',
        bankAccount: '00 0000 0000 0000 0000 0000 0000',
        bankName: 'Powszechny Bank Pieniędzy i Bizensu',
        extraInformation: [
            'Faktura za okres 01.01.3333-01.01.4444',
            'PO: 33333333',
            'Project Number: TestProject1345',
        ],
        currency: 'PLN',
    }
}
