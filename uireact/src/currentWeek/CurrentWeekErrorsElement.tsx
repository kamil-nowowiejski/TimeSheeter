import styles from './CurrentWeekErrorsElement.module.css'
import { WorkDay } from './models.ts'

interface CurrentWeekErrorsElementProps {
    workDays: WorkDay[] | undefined;
}

export default function CurrentWeekErrorsElement(props: CurrentWeekErrorsElementProps) {
    if (props.workDays === undefined)
        return

    return (
        <div className={styles.errors}>
            <label className={styles.errorLabelTitle}>Correct the following errors:</label>
            {props.workDays
                .map(getErrorMessage)
                .filter(x => x !== undefined)
                .map(x => (
                    <label className={styles.errorLabel} key={x.key}>{x.error}</label>
                ))}
        </div>
    )
}

interface ErrorProps {
    key: number;
    error: string;
}

function getErrorMessage(workDay: WorkDay): ErrorProps | undefined {
    if (workDay.error === undefined)
        return undefined

    const weekDay = workDay.getLongWeekDayName()
    const error ='• ' +weekDay + ': ' + workDay.error
    return { key: workDay.dayIndex, error: error }
}


