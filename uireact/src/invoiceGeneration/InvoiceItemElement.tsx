import { InvoiceItem } from './models.ts'
import { useState } from 'react'

interface InvoiceItemElementProps {
    index: number
    invoiceItem: InvoiceItem
    passItemToParent: (index: number, item: InvoiceItem) => void
}

export default function InvoiceItemElement(props: InvoiceItemElementProps) {
    const [item, setItem] = useState<InvoiceItem>(props.invoiceItem)
    props.passItemToParent(props.index, item)
    return (
        <tr>
            <td>{props.index}</td>

            <td>
                <input
                    type='text'
                    defaultValue={item.description}
                    onInput={(e) => onDescriptionChange(e, item, setItem)}
                />
            </td>

            <td>
                <input type='text' defaultValue={item.unit} onInput={(e) => onUnitChange(e, item, setItem)} />
            </td>

            <td>
                <input type='number' defaultValue={item.amount} onInput={(e) => onAmountChange(e, item, setItem)} />
            </td>

            <td>
                <input type='number' step="0.01" defaultValue={item.netPrice} onInput={(e) => onNetPriceChange(e, item, setItem)} />
            </td>

            <td>
                <input type='number' step="0.01" defaultValue={item.vatRate} onInput={(e) => onVatRateChange(e, item, setItem)} />
            </td>

            <td>{item.vatValue}</td>

            <td>{item.grossValue}</td>
        </tr>
    )
}
function onUnitChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItem,
    setItem: (i: InvoiceItem) => void,
) {
    const shallow = item.toShallow()
    shallow.unit = event.currentTarget.value
    setItem(item.update(shallow))
}

function onAmountChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItem,
    setItem: (i: InvoiceItem) => void,
) {
    const shallow = item.toShallow()
    shallow.amount = event.currentTarget.valueAsNumber
    setItem(item.update(shallow))
}

function onNetPriceChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItem,
    setItem: (i: InvoiceItem) => void,
) {
    const shallow = item.toShallow()
    shallow.netPrice = event.currentTarget.valueAsNumber
    setItem(item.update(shallow))
}

function onDescriptionChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItem,
    setItem: (i: InvoiceItem) => void,
) {
    const shallow = item.toShallow()
    shallow.description = event.currentTarget.value
    setItem(item.update(shallow))
}

function onVatRateChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItem,
    setItem: (i: InvoiceItem) => void,
) {
    const shallow = item.toShallow()
    const vatRateFullNumber = event.currentTarget.valueAsNumber
    shallow.vatRate = vatRateFullNumber / 100
    setItem(item.update(shallow))
}
