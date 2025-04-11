import styles from './InvoiceDetails.module.css'
import CompanyDetails from './CompanyDetails.tsx'
import { Company, InvoiceGeneralInformation } from '../models.ts'
import GeneralDetails from './GeneralDetails.tsx'
import PaymentDetails from './PaymentDetails.tsx'

export interface InvoiceDetailsProps {
    issuer: Company
    buyer: Company
    info: InvoiceGeneralInformation
}

export default function InvoiceDetails(props: InvoiceDetailsProps) {

    return (
        <div className={styles.masterContainer}>
            <CompanyDetails title='Issuer' company={props.issuer} style={{gridRow: 1, gridColumn:1}}/>
            <CompanyDetails title='Buyer' company={props.buyer} style={{gridRow: 1, gridColumn:2}}/>
            <GeneralDetails invoiceTitle={props.info.title} placeOfIssue={props.info.placeOfIssue} 
                date={props.info.date} extraInformation={props.info.extraInformation}
                style={{gridRow: 2, gridColumn:1}}/>
            <PaymentDetails paymentMethod={props.info.paymentMethod} paymentDeadline={props.info.paymentDeadline}
                bankAccount={props.info.bankAccount} bankName={props.info.bankName}
                style={{gridRow: 2, gridColumn:2}} />
        </div>
    )
}
