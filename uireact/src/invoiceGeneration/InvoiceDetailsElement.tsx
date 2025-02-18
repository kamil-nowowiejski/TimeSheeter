import styles from './InvoiceDetailsElement.module.css'
import CompanyDetails from './CompanyDetailsElement.tsx'
import { Company } from './models.ts'
import { AmountCalculationMode } from './ModeSelectorElement.tsx'

interface InvoiceDetailsElementProps {
    amountCalculationMode: AmountCalculationMode
    issuer: Company
    buyer: Company
}

export default function InvoiceDetails(props: InvoiceDetailsElementProps) {

    return (
        <div className={styles.companiesContainer}>
            <CompanyDetails title='Issuer' company={props.issuer} />
            <div className={styles.separator}></div>
            <CompanyDetails title='Buyer' company={props.buyer} />
        </div>
    )
}
