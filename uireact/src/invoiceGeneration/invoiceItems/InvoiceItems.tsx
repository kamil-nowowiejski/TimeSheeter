import styles from './InvoiceItems.module.scss'
import { InvoiceItem as InvoiceItemModel } from '../models.ts'
import InvoiceItem from './InvoiceItem.tsx'
import { useCallback, useRef } from 'react'

export interface InvoiceItemsProps {
    invoiceItems: InvoiceItemModel[]
    passInvoiceItemsToParent: (items: InvoiceItemModel[]) => void
}

export default function InvoiceItems(props: InvoiceItemsProps) {
    const invoiceItems = useRef<TrackedInvoiceItem[]>([])

    const passInvoiceItemToParent = useCallback((index: number, item: InvoiceItemModel) => {
        if (index > invoiceItems.current.length) {
            invoiceItems.current.push(item)
        } else {
            invoiceItems.current[index-1] = item
        }
        props.passInvoiceItemsToParent(invoiceItems.current)
    })

    return (
        <table className={styles.invoiceItemsTable}>
            <thead>
                <tr>
                    <th className={styles.index}>No.</th>
                    <th className={styles.name}>Name</th>
                    <th className={styles.unit}>Unit</th>
                    <th className={styles.amount}>Amount</th>
                    <th className={styles.netPrice}>Net price</th>
                    <th className={styles.vatRate}>VAT rate</th>
                    <th className={styles.vatValue}>VAT value</th>
                    <th className={styles.grossValue}>Gross value</th>
                </tr>
            </thead>

            <tbody>
                {props.invoiceItems.map((item, index) => (
                    <InvoiceItem
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
    item: InvoiceItemModel
    index: number
}
