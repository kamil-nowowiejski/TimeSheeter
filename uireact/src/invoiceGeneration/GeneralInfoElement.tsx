import { FormNames } from './formNames.ts'
import { InvoiceGeneralInformation } from './models.ts'
import styles from './GeneralInfoElement.module.css'
import InvoiceItemEntry, { InvoiceDetailEntryProps } from './InvoiceDetailEntryElement.tsx'

interface GeneralInfoElementProps {
    info: InvoiceGeneralInformation
}

export default function GeneralInfoElement(props: GeneralInfoElementProps) {
    const entries: InvoiceDetailEntryProps[] = createEntries(props)

    return (
        <div className={styles.container}>
            {entries.map((e) => <InvoiceItemEntry key={e.label} {...e} />)}
        </div>
    )
}

function createEntries(props: GeneralInfoElementProps): InvoiceDetailEntryProps[] {
    return [
        {
            label: "Title",
            defaultValue: props.info.title,
            formItemName: FormNames.InvoiceTitle
        },
        {
            label: "Place of issue",
            defaultValue: props.info.placeOfIssue,
            formItemName: FormNames.PlaceOfIssue
        },
        {
            label: "Date of issue",
            defaultValue: props.info.date,
            formItemName: FormNames.DateOfIssue
        },
        {
            label: "Method of payment",
            defaultValue: props.info.paymentMethod,
            formItemName: FormNames.MethodOfPayment
        },
        {
            label: "Payment deadline",
            defaultValue: props.info.paymentDeadline,
            formItemName: FormNames.PaymentDeadline
        },
        {
            label: "Bank account",
            defaultValue: props.info.bankAccount,
            formItemName: FormNames.BankAccount
        },
        {
            label: "Bank name",
            defaultValue: props.info.bankName,
            formItemName: FormNames.BankName,
            useMultiLine: true
        },
        {
            label: "Extra information",
            defaultValue: props.info.extraInformation,
            formItemName: FormNames.ExtraInformation,
            useMultiLine: true,
            isOptional: true
        }
    ]
}
