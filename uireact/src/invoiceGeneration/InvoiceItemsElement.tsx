import { InvoiceItem } from './models.ts'
import InvoiceItemElement from './InvoiceItemElement.tsx'

interface InvoiceItemsElementProps {
    invoiceItems: InvoiceItem[]
}

export default function InvoiceItemsElement(props: InvoiceItemsElementProps) {
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
                    <InvoiceItemElement key={index + 1} index={index + 1} invoiceItem={item} />
                ))}
            </tbody>
        </table>
    )
}
