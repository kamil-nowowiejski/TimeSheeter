import styles from './CompanyDetailsElement.module.css'
import { Company } from './models.ts'

interface CompanyDetailsElementProps {
    title: string
    company: Company
}

export default function CompanyDetails(props: CompanyDetailsElementProps) {
    const entries: Entry[] = createEntries(props)

    return (
        <div className={styles.companyContainer}>
            <label className={styles.title}>{props.title}</label>
            {entries.map((e) => createDetailEntry(e))}
        </div>
    )
}

function createDetailEntry(entry: Entry) {
    return (
        <div key={entry.label} className={styles.entrySection}>
            <label className={styles.entryLabel}>{entry.label}</label>
            <input
                type='text'
                defaultValue={entry.value}
                name={entry.formItemName}
            />
        </div>
    )
}

interface Entry {
    label: string
    value: string
    formItemName: string
}

function createEntries(props: CompanyDetailsElementProps): Entry[] {
    return [
        {
            label: 'Name:',
            value: props.company.name.defaultValue,
            formItemName: props.company.name.formItemName,
        },
        {
            label: 'NIP:',
            value: props.company.nip.defaultValue,
            formItemName: props.company.nip.formItemName,
        },
        {
            label: 'Street: ',
            value: props.company.street.defaultValue,
            formItemName: props.company.street.formItemName
        },
        {
            label: 'City: ',
            value: props.company.city.defaultValue,
            formItemName: props.company.city.formItemName
        },
        {
            label: 'Postal code: ',
            value: props.company.postalCode.defaultValue,
            formItemName: props.company.postalCode.formItemName
        },
    ]
}
