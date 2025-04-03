import styles from './InvoiceGenerator.module.css'
import { Earnings, InvoiceTemplate, Month } from '../common/models.ts'
import MonthPicker from '../common/MonthPickerElement.tsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import AmountCalculationModePicker, { AmountCalculationMode } from './ModeSelectorElement.tsx'
import { InvoiceDetails } from './invoiceDetails/index.ts'
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
import WorkDaysApi from '../apis/workDaysApi.ts'
import EarningsApi from '../apis/earningsApi.ts'
import { WorkDay } from '../common/models.ts'
import InvoiceTemplateApi from '../apis/invoiceTemplateApi.ts'
import HumanizerApi from '../apis/humanizerApi.ts'

export default function InvoiceGenerationElement() {
    const [month, setMonth] = useState<Month>(Month.current())
    const [mode, setMode] = useState<AmountCalculationMode>(AmountCalculationMode.overridenHours)
    const [initialData, setInitialData] = useState<InitialData>()

    const invoiceItems = useRef<InvoiceItem>([])
    const passInvoiceItemsToParent = useCallback((items: InvoiceItem[]) => invoiceItems.current = items)

    useEffect(() => {
        async function fetchData() {
            const workDaysPromise = new WorkDaysApi().getWorkDays(month.getDate(1), month.getDate(0))
            const earningsPromise = new EarningsApi().get()
            const invoiceTemplatePromise = new InvoiceTemplateApi().get()
            const values = await Promise.all([workDaysPromise, earningsPromise, invoiceTemplatePromise])
            const workDays = values[0]
            const earnings = values[1]
            const invoiceTemplate = values[2]
            const invoiceItem = createInvoiceItem(workDays, earnings, invoiceTemplate)
            const initialData = createInitialData(invoiceItem, invoiceTemplate, earnings)
            setInitialData(initialData)
        }

        fetchData()
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
                generateInvoice(formData, invoiceItems.current, initialData.currency)
            }}
            className={styles.masterContainer}
        >
            <MonthPicker defaultValue={month} onInput={(month) => setMonth(month)} />

            <AmountCalculationModePicker mode={mode} onInput={onModeSelected} />
            <InvoiceDetails
                issuer={initialData.issuer}
                buyer={initialData.buyer}
                info={initialData.generalInfo}
            />

            <InvoiceItemsElement
                invoiceItems={initialData.invoiceItems}
                passInvoiceItemsToParent={passInvoiceItemsToParent}
            />

            <button type='submit'>Generate Invoice</button>
        </form>
    )
}

function onModeSelected(mode: AmountCalculationMode) {
}

async function generateInvoice(data: FormData, invoiceItems: InvoiceItem[], currency: string) {
    const issuerStreet = data.get(FormNames.IssuerStreet) as string
    const issuerCity = data.get(FormNames.IssuerCity) as string
    const issuerPostalCode = data.get(FormNames.IssuerPostalCode) as string

    const buyerStreet = data.get(FormNames.BuyerStreet) as string
    const buyerCity = data.get(FormNames.BuyerCity) as string
    const buyerPostalCode = data.get(FormNames.BuyerPostalCode) as string

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
        items: toPdfInvoiceItems(invoiceItems),
        aggregate: await calculateAggregate(invoiceItems),
        methodOfPayment: data.get(FormNames.MethodOfPayment) as string,
        paymentDeadline: data.get(FormNames.PaymentDeadline) as string,
        bankAccount: data.get(FormNames.BankAccount) as string,
        bankName: data.get(FormNames.BankName) as string,
        extraInformation: (data.get(FormNames.ExtraInformation) as string).split('\n'),
        currency: currency,
    }
    const fileName = invoice.title + '.pdf'
    generatePdfInvoice(invoice, fileName, new FontsProvider())

    async function calculateAggregate(items: InvoiceItem[]): Promise<InvoiceAggregate> {
        const grossValueInWords = await new HumanizerApi().get(items[0].grossValue)
        return {
            netValue: items[0].netPrice,
            vatRate: items[0].vatRate,
            vatValue: items[0].vatValue,
            grossValue: items[0].grossValue,
            grossValueInWords: grossValueInWords + ' ' + currency,
        }
    }
    function toPdfInvoiceItems(items: InvoiceItem[]): PdfInvoiceItem[] {
        const pdfItem = {
            key: 1,
            description: items[0].description,
            unit: items[0].unit,
            amount: items[0].amount,
            netPrice: items[0].netPrice,
            netValue: items[0].netPrice,
            vatRate: items[0].vatRate,
            vatValue: items[0].vatValue,
            grossValue: items[0].grossValue,
        }
        return [pdfItem]
    }
}

interface InitialData {
    issuer: Company
    buyer: Company
    invoiceItems: InvoiceItem[]
    generalInfo: InvoiceGeneralInformation
    currency: string
}

class FontsProvider implements IFontsProvider {
    public getFontRegular(): Promise<string> {
        return this.getFont('arial.ttf')
    }

    public getFontBold(): Promise<string> {
        return this.getFont('arialbd.ttf')
    }

    private async getFont(fileName: string): Promise<string> {
        const response = await fetch(`fonts/${fileName}`)
        const bytes = await response.bytes()
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

function createInvoiceItem(workDays: WorkDay[], earnings: Earnings, invoiceTemplate: InvoiceTemplate): InvoiceItem {
    //TODO implement modes
    const amount = workDays.length * 8
    const netPrice = amount * earnings.earningsPerHour
    return new InvoiceItem(
        invoiceTemplate.invoiceItemTemplate.description,
        invoiceTemplate.invoiceItemTemplate.unit,
        amount,
        netPrice,
        invoiceTemplate.invoiceItemTemplate.vatRate,
    )
}

function createInitialData(
    invoiceItem: InvoiceItem,
    invoiceTemplate: InvoiceTemplate,
    earnings: Earnings,
): InitialData {
    const currentDate = new Date()
    return {
        issuer: {
            name: {
                defaultValue: invoiceTemplate.issuer.name,
                formItemName: FormNames.IssuerName,
            },

            nip: {
                defaultValue: invoiceTemplate.issuer.nip,
                formItemName: FormNames.IssuerNip,
            },
            street: {
                defaultValue: invoiceTemplate.issuer.street,
                formItemName: FormNames.IssuerStreet,
            },
            postalCode: {
                defaultValue: invoiceTemplate.issuer.postalCode,
                formItemName: FormNames.IssuerPostalCode,
            },
            city: {
                defaultValue: invoiceTemplate.issuer.city,
                formItemName: FormNames.IssuerCity,
            },
        },
        buyer: {
            name: {
                defaultValue: invoiceTemplate.buyer.name,
                formItemName: FormNames.BuyerName,
            },

            nip: {
                defaultValue: invoiceTemplate.buyer.nip,
                formItemName: FormNames.BuyerNip,
            },
            street: {
                defaultValue: invoiceTemplate.buyer.street,
                formItemName: FormNames.BuyerStreet,
            },
            postalCode: {
                defaultValue: invoiceTemplate.buyer.postalCode,
                formItemName: FormNames.BuyerPostalCode,
            },
            city: {
                defaultValue: invoiceTemplate.buyer.city,
                formItemName: FormNames.BuyerCity,
            },
        },
        invoiceItems: [invoiceItem],
        generalInfo: {
            title: getInvoiceTitle(invoiceTemplate.titleTemplate, currentDate),
            placeOfIssue: invoiceTemplate.placeOfIssue,
            date: formatDate(currentDate),
            paymentMethod: invoiceTemplate.paymentMethod,
            paymentDeadline: getPaymentDeadline(currentDate),
            bankAccount: invoiceTemplate.bankAccount,
            bankName: invoiceTemplate.bankName,
            extraInformation: invoiceTemplate.extraInformation,
        },
        currency: earnings.currency,
    }
}

function getInvoiceTitle(titleTemplate: string, currentDate: Date) {
    const month = addLeadingZeros(currentDate.getMonth() + 1, 2)
    const invoiceNumber = `01/${month}/${currentDate.getFullYear()}`
    return titleTemplate.replace('{number}', invoiceNumber)
}

function getPaymentDeadline(currentDate: Date) {
    const deadline = currentDate
    deadline.setDate(deadline.getDate() + 30)
    return formatDate(deadline)
}

function formatDate(date: Date) {
    const day = addLeadingZeros(date.getDate(), 2)
    const month = addLeadingZeros(date.getMonth() + 1, 2)
    return `${day}-${month}-${date.getFullYear()}`
}

function addLeadingZeros(num: number, size: number) {
    let stringNumber = num.toString()
    while (stringNumber.length < size) stringNumber = '0' + num
    return stringNumber
}
