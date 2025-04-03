import { CSSProperties } from 'react'
import { FormNames } from '../formNames.ts'
import { Section, Entry  } from '../shared/index.ts'

interface PaymentDetailsProps {
    paymentMethod: string,
    paymentDeadline: string,
    bankAccount: string,
    bankName: string
    style?: CSSProperties
}

export default function PaymentDetails(props: PaymentDetailsProps) {
    return (<Section title="Payment" entries={createEntries(props)} style={props.style}/>)
}

function createEntries(props: PaymentDetailsProps): Entry[] {
    return [
        {
            label: "Method of payment",
            defaultValue: props.paymentMethod,
            formItemName: FormNames.MethodOfPayment
        },
        {
            label: "Payment deadline",
            defaultValue: props.paymentDeadline,
            formItemName: FormNames.PaymentDeadline
        },
        {
            label: "Bank account",
            defaultValue: props.bankAccount,
            formItemName: FormNames.BankAccount
        },
        {
            label: "Bank name",
            defaultValue: props.bankName,
            formItemName: FormNames.BankName,
        }
    ]
}
