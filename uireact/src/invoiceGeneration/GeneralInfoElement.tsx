import { FormNames } from './formNames.ts'
import { InvoiceGeneralInformation } from './models.ts'
import styles from './GeneralInfoElement.module.css'

interface GeneralInfoElementProps {
    info: InvoiceGeneralInformation
}

export default function GeneralInfoElement(props: GeneralInfoElementProps) {
    return (
        <div className={styles.container}>
            <div className={styles.inputField}>
                <label>Title</label>
                <input name={FormNames.InvoiceTitle} type='text' defaultValue={props.info.title} />
            </div>

            <div className={styles.inputField}>
                <label>Place of issue</label>
                <input name={FormNames.PlaceOfIssue} type='text' defaultValue={props.info.placeOfIssue} />
            </div>

            <div className={styles.inputField}>
                <label>Issue date</label>
                <input name={FormNames.DateOfIssue} type='text' defaultValue={props.info.issueDate} />
            </div>

            <div className={styles.inputField}>
                <label>Finish date</label>
                <input name={FormNames.FinishDate} type='text' defaultValue={props.info.finishDate} />
            </div>

            <div className={styles.inputField}>
                <label>Payment method</label>
                <input name={FormNames.MethodOfPayment} type='text' defaultValue={props.info.paymentMethod} />
            </div>

            <div className={styles.inputField}>
                <label>Payment deadline</label>
                <input name={FormNames.PaymentDeadline} type='text' defaultValue={props.info.paymentDeadline} />
            </div>

            <div className={styles.inputField}>
                <label>Bank account</label>
                <input name={FormNames.BankAccount} type='text' defaultValue={props.info.bankAccount} />
            </div>

            <div className={styles.inputField}>
                <label>Bank name</label>
                <input name={FormNames.BankName} type='text' defaultValue={props.info.bankName} />
            </div>

            <div className={styles.inputField}>
                <label>Extra information</label>
                <textarea
                    className={styles.extraInfo}
                    name={FormNames.ExtraInformation}
                    defaultValue={props.info.extraInformation.join('\n')}
                />
            </div>
        </div>
    )
}
