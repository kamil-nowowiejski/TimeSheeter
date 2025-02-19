import { Month } from '../common/models.ts'
import MonthPicker from '../common/MonthPickerElement.tsx'
import { useEffect, useRef, useState } from 'react'
import AmountCalculationModePicker, { AmountCalculationMode } from './ModeSelectorElement.tsx'
import InvoiceDetails from './InvoiceDetailsElement.tsx'
import { Company, InvoiceItem } from './models.ts'
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

export default function InvoiceGenerationElement() {
    const [month, setMonth] = useState<Month>(Month.current())
    const [mode, setMode] = useState<AmountCalculationMode>(AmountCalculationMode.overridenHours)
    const [initialData, setInitialData] = useState<InitialData>()

    useEffect(() => {
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

            <InvoiceItemsElement invoiceItems={initialData.invoiceItems}/>

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
}

class FontsProvider implements IFontsProvider {
    getFontRegular(): Promise<string> {
        return Promise.reject('not implemented')
    }

    getFontBold(): Promise<string> {
        return Promise.reject('not implemented')
    }
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
        invoiceItems:[
           new InvoiceItem('umow nr xd na swiadczenie uslug od dnia xx/xx/xx do dno xx/xx/xx', 'h', 168, 23520, 0.23) 
        ]
    }
}
