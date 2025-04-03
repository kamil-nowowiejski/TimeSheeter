import { CSSProperties } from 'react'
import { Company } from '../models.ts'
import { Section, Entry } from '../shared/index.ts'

interface CompanyDetialsProps {
    title: string
    company: Company
    style?: CSSProperties
}

export default function CompanyDetails(props: CompanyDetialsProps) {
    return (<Section title={props.title} entries={createEntries(props.company)} style={props.style}/>)
}

function createEntries(company: Company): Entry[] {
    return [
        {
            label: 'Name:',
            defaultValue: company.name.defaultValue,
            formItemName: company.name.formItemName,
        },
        {
            label: 'NIP:',
            defaultValue: company.nip.defaultValue,
            formItemName: company.nip.formItemName,
        },
        {
            label: 'Street: ',
            defaultValue: company.street.defaultValue,
            formItemName: company.street.formItemName
        },
        {
            label: 'City: ',
            defaultValue: company.city.defaultValue,
            formItemName: company.city.formItemName
        },
        {
            label: 'Postal code: ',
            defaultValue: company.postalCode.defaultValue,
            formItemName: company.postalCode.formItemName,
        },
    ]
}
