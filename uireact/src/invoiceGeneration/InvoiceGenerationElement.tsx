import { Earnings, Month } from '../common/models.ts'
import MonthPicker from '../common/MonthPickerElement.tsx'
import { useEffect, useRef, useState } from 'react'
import AmountCalculationModePicker, { AmountCalculationMode } from './ModeSelectorElement.tsx'
import InvoiceDetails from './InvoiceDetailsElement.tsx'
import { Company, InvoiceGeneralInformation, InvoiceItem } from './models.ts'
import {
    Company as PdfCompany,
    FontsProvider as IFontsProvider,
    generateInvoice as generatePdfInvoice,
    Invoice,
    InvoiceItem as PdfInvoiceItem,
} from './pdfGeneration/main.ts'
import { InvoiceAggregate } from './pdfGeneration/models/input.ts'
import { FormNames } from './formNames.ts'
import InvoiceItemsElement from './InvoiceItemsElement.tsx'
import GeneralInfoElement from './GeneralInfoElement.tsx'
import WorkDaysApi from '../apis/workDaysApi.ts'
import EarningsApi from '../apis/earningsApi.ts'
import { WorkDay } from '../common/models.ts'

export default function InvoiceGenerationElement() {
    const [month, setMonth] = useState<Month>(Month.current())
    const [mode, setMode] = useState<AmountCalculationMode>(AmountCalculationMode.overridenHours)
    const [initialData, setInitialData] = useState<InitialData>()

    useEffect(async () => {
        const workDaysPromise =  new WorkDaysApi().getWorkDays(month.getDate(1), month.getDate(-1))
        const earningsPromise = new EarningsApi().get()
        const values = await Promise.all([ workDaysPromise, earningsPromise ])
        const workDays = values[0]
        const earnings = values[1]
        const invoiceItem = createInvoiceItem(workDays, earnings)
        createInitialData(workDays)
        setInitialData(createEmptyData())
    }, [])

    if (initialData === undefined) {
        //todo maybe spinner
        return
    }

    return (
        <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                generateInvoice(formData)
            }}
        >
            <MonthPicker defaultValue={month} onInput={(month) => setMonth(month)} />

            <AmountCalculationModePicker mode={mode} onInput={onModeSelected} />
            <InvoiceDetails
                amountCalculationMode={mode}
                issuer={initialData.issuer}
                buyer={initialData.buyer}
            />

            <InvoiceItemsElement invoiceItems={initialData.invoiceItems} />
            <GeneralInfoElement info={initialData.generalInfo} />

            <button type='submit'>Generate Invoice</button>
        </form>
    )
}

function onModeSelected(mode: AmountCalculationMode) {
}

function generateInvoice(data: FormData) {
    const issuerStreet = data.get(FormNames.IssuerStreet) as string
    const issuerCity = data.get(FormNames.IssuerCity) as string
    const issuerPostalCode = data.get(FormNames.IssuerPostalCode) as string

    const buyerStreet = data.get(FormNames.BuyerStreet) as string
    const buyerCity = data.get(FormNames.BuyerCity) as string
    const buyerPostalCode = data.get(FormNames.BuyerPostalCode) as string

    const invoiceItem = new InvoiceItem(
        data.get(FormNames.InvoiceItemDescription) as string,
        data.get(FormNames.InvoiceItemUnit) as string,
        Number.parseInt(data.get(FormNames.InvoiceItemAmount) as string),
        Number.parseFloat(data.get(FormNames.InvoiceItemNetPrice) as string),
        Number.parseFloat(data.get(FormNames.InvoiceItemVatRate) as string),
    )

    const invoice: Invoice = {
        title: data.get(FormNames.InvoiceTitle) as string,
        placeOfIssue: data.get(FormNames.PlaceOfIssue) as string,
        dateOfIssue: data.get(FormNames.DateOfIssue) as string,
        issuer: {
            name: data.get(FormNames.IssuerName) as string,
            nip: data.get(FormNames.IssuerNip) as string,
            address1: issuerStreet,
            address2: `${issuerPostalCode} ${issuerCity}`,
        },
        buyer: {
            name: data.get(FormNames.BuyerName) as string,
            nip: data.get(FormNames.BuyerNip) as string,
            address1: buyerStreet,
            address2: `${buyerPostalCode} ${buyerCity}`,
        },
        items: toPdfInvoiceItems(invoiceItem),
        aggregate: calculateAggregate(invoiceItem),
        methodOfPayment: data.get(FormNames.MethodOfPayment) as string,
        paymentDeadline: data.get(FormNames.PaymentDeadline) as string,
        bankAccount: data.get(FormNames.BankAccount) as string,
        bankName: data.get(FormNames.BankName) as string,
        extraInformation: (data.get(FormNames.ExtraInformation) as string).split('\n'),
        currency: 'XDDDD',
    }
    const fileName = invoice.title + '.pdf'
    generatePdfInvoice(invoice, fileName, new FontsProvider())

    function calculateAggregate(item: InvoiceItem): InvoiceAggregate {
        return {
            netValue: item.netPrice,
            vatRate: item.vatRate,
            vatValue: item.vatValue,
            grossValue: item.grossValue,
            grossValueInWords: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        }
    }
    function toPdfInvoiceItems(item: InvoiceItem): PdfInvoiceItem[] {
        const pdfItem = {
            key: 1,
            description: item.description,
            unit: item.unit,
            amount: item.amount,
            netPrice: item.netPrice,
            netValue: item.netPrice,
            vatRate: item.vatRate,
            vatValue: item.vatValue,
            grossValue: item.grossValue,
        }
        return [pdfItem]
    }
}

interface InitialData {
    issuer: Company
    buyer: Company
    invoiceItems: InvoiceItem[]
    generalInfo: InvoiceGeneralInformation
}

class FontsProvider implements IFontsProvider {
    public getFontRegular(): Promise<string> {
        return this.getFont('arial.ttf')
    }

    public getFontBold(): Promise<string> {
        return this.getFont('arialbd.ttf')
    }

    private async getFont(fileName: string): Promise<string>{

        const response = await fetch(`fonts/${fileName}`)
        const bytes =  await response.bytes()
        return this.arrayBufferToBase64(bytes)
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

function createInvoiceItem(workDays:WorkDay[], earnings: Earnings): InitialData {

    //TODO implement modes
    return new InvoiceItem()


}
function createEmptyData(): InitialData {
    return {
        issuer: {
            name: {
                defaultValue: '',
                formItemName: FormNames.IssuerName,
            },

            nip: {
                defaultValue: '',
                formItemName: FormNames.IssuerNip,
            },
            street: {
                defaultValue: '',
                formItemName: FormNames.IssuerStreet,
            },
            postalCode: {
                defaultValue: '',
                formItemName: FormNames.IssuerPostalCode,
            },
            city: {
                defaultValue: '',
                formItemName: FormNames.IssuerCity,
            },
        },
        buyer: {
            name: {
                defaultValue: '',
                formItemName: FormNames.BuyerName,
            },

            nip: {
                defaultValue: '',
                formItemName: FormNames.BuyerNip,
            },
            street: {
                defaultValue: '',
                formItemName: FormNames.BuyerStreet,
            },
            postalCode: {
                defaultValue: '',
                formItemName: FormNames.BuyerPostalCode,
            },
            city: {
                defaultValue: '',
                formItemName: FormNames.BuyerCity,
            },
        },
        invoiceItems: [
            new InvoiceItem('umow nr xd na swiadczenie uslug od dnia xx/xx/xx do dno xx/xx/xx', 'h', 168, 23520, 0.23),
        ],
        generalInfo: {
            title: 'dgdgd',
            placeOfIssue: 'Wroclaw',
            date: '',
            paymentMethod: 'przelew',
            paymentDeadline: '',
            bankAccount: '00 0000 000 0000 0000 0000',
            bankName: 'Bank naem',
            extraInformation: [
                'item 1',
                'item 2',
                'item 3',
            ],
        },
    }
}
