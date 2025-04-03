import { CSSProperties } from 'react'
import { FormNames } from '../formNames.ts'
import { Section, Entry  } from '../shared/index.ts'

interface GeneralDetialsProps {
    invoiceTitle: string,
    placeOfIssue: string,
    date: string
    extraInformation: string[]
    style?: CSSProperties
}

export default function GeneralDetails(props: GeneralDetialsProps) {
    return (<Section title="General" entries={createEntries(props)} style={props.style}/>)
}

function createEntries(props: GeneralDetialsProps): Entry[] {
    return [
        {
            label: "Title",
            defaultValue: props.invoiceTitle,
            formItemName: FormNames.InvoiceTitle
        },
        {
            label: "Place of issue",
            defaultValue: props.placeOfIssue,
            formItemName: FormNames.PlaceOfIssue
        },
        {
            label: "Date of issue",
            defaultValue: props.date,
            formItemName: FormNames.DateOfIssue
        },
        {
            label: "Extra information",
            defaultValue: props.extraInformation,
            formItemName: FormNames.ExtraInformation,
            isOptional: true,
            useMultiLine: true,
        }
    ]
}
