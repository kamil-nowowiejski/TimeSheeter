import { InvoiceItem } from './models.ts'
import InvoiceItemElement from './InvoiceItemElement.tsx'
import { useCallback, useRef } from 'react'

interface InvoiceItemsElementProps {
    invoiceItems: InvoiceItem[]
    passInvoiceItemsToParent: (items: InvoiceItem[]) => void
}

export default function InvoiceItemsElement(props: InvoiceItemsElementProps) {
    const invoiceItems = useRef<TrackedInvoiceItem[]>([])

    const passInvoiceItemToParent = useCallback((index: number, item: InvoiceItem) => {
        if (index > invoiceItems.current.length) {
            invoiceItems.current.push(item)
        } else {
            invoiceItems.current[index-1] = item
        }
        props.passInvoiceItemsToParent(invoiceItems.current)
    })

    return (
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Amount</th>
                    <th>Net price</th>
                    <th>VAT rate</th>
                    <th>VAT value</th>
                    <th>Gross value</th>
                </tr>
            </thead>

            <tbody>
                {props.invoiceItems.map((item, index) => (
                    <InvoiceItemElement
                        key={index + 1}
                        index={index + 1}
                        invoiceItem={item}
                        passItemToParent={passInvoiceItemToParent}
                    />
                ))}
            </tbody>
        </table>
    )
}

interface TrackedInvoiceItem {
    item: InvoiceItem
    index: number
}
