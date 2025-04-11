import styles from './InvoiceItem.module.css'
import { InvoiceItem as InvoiceItemModel } from '../models.ts'
import { useState } from 'react'
import { Entry } from '../shared/index.ts'

interface InvoiceItemProps {
    index: number
    invoiceItem: InvoiceItemModel
    passItemToParent: (index: number, item: InvoiceItemModel) => void
}

export default function InvoiceItem(props: InvoiceItemProps) {
    const [item, setItem] = useState<InvoiceItemModel>(props.invoiceItem)
    props.passItemToParent(props.index, item)
    return (
        <tr>
            <td className={styles.index}>{props.index}</td>

            <td className={styles.description}>
                <Entry defaultValue={item.description} useMultiLine onInput={(e) => onDescriptionChange(e, item, setItem)}/>
            </td>

            <td className={styles.unit}>
                <Entry defaultValue={item.unit} onInput={(e) => onUnitChange(e, item, setItem)}/>
            </td>

            <td className={styles.amount}>
                <Entry defaultValue={item.amount} numbersOnly onInput={(e) => onAmountChange(e, item, setItem)}/>
            </td>

            <td className={styles.netPrice}>
                <Entry defaultValue={item.netPrice} numbersOnly onInput={(e) => onNetPriceChange(e, item, setItem)}/>
            </td>

            <td className={styles.vatRate}>
                <Entry defaultValue={item.vatRate} numbersOnly onInput={(e) => onVatRateChange(e, item, setItem)}/>
            </td>

            <td className={styles.vatValue}>{item.vatValue}</td>

            <td className={styles.grossValue}>{item.grossValue}</td>
        </tr>
    )
}
function onUnitChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItemModel,
    setItem: (i: InvoiceItemModel) => void,
) {
    const shallow = item.toShallow()
    shallow.unit = event.currentTarget.value
    setItem(item.update(shallow))
}

function onAmountChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItemModel,
    setItem: (i: InvoiceItemModel) => void,
) {
    const shallow = item.toShallow()
    shallow.amount = event.currentTarget.valueAsNumber
    setItem(item.update(shallow))
}

function onNetPriceChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItemModel,
    setItem: (i: InvoiceItemModel) => void,
) {
    const shallow = item.toShallow()
    shallow.netPrice = event.currentTarget.valueAsNumber
    setItem(item.update(shallow))
}

function onDescriptionChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItemModel,
    setItem: (i: InvoiceItemModel) => void,
) {
    const shallow = item.toShallow()
    shallow.description = event.currentTarget.value
    setItem(item.update(shallow))
}

function onVatRateChange(
    event: React.FormEvent<HTMLInputElement>,
    item: InvoiceItemModel,
    setItem: (i: InvoiceItemModel) => void,
) {
    const shallow = item.toShallow()
    const vatRateFullNumber = event.currentTarget.valueAsNumber
    shallow.vatRate = vatRateFullNumber / 100
    setItem(item.update(shallow))
}
