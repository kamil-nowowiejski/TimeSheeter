import styles from './CompanyDetailsElement.module.css'
import { Company } from './models.ts'
import InvoiceDetailEntry, { InvoiceDetailEntryProps } from './InvoiceDetailEntryElement.tsx'
import SectionTitle from './SectionTitleElement.tsx'

interface CompanyDetailsElementProps {
    title: string
    company: Company
}

export default function CompanyDetails(props: CompanyDetailsElementProps) {
    return (
        <div className={styles.companyContainer}>
            <SectionTitle title={props.title}/>
            {createEntries(props).map((e) => ( <InvoiceDetailEntry {...e}/>))}
        </div>
    )
}

function createEntries(props: CompanyDetailsElementProps): InvoiceDetailEntryProps[] {
    return [
        {
            label: 'Name:',
            defaultValue: props.company.name.defaultValue,
            formItemName: props.company.name.formItemName,
        },
        {
            label: 'NIP:',
            defaultValue: props.company.nip.defaultValue,
            formItemName: props.company.nip.formItemName,
        },
        {
            label: 'Street: ',
            defaultValue: props.company.street.defaultValue,
            formItemName: props.company.street.formItemName
        },
        {
            label: 'City: ',
            defaultValue: props.company.city.defaultValue,
            formItemName: props.company.city.formItemName
        },
        {
            label: 'Postal code: ',
            defaultValue: props.company.postalCode.defaultValue,
            formItemName: props.company.postalCode.formItemName
        },
    ]
}
