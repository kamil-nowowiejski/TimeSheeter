import styles from './WorkDayElement.module.css'
import { useState } from 'react'
import { WorkDay, WorkTimestamp } from '../common/models.ts';
import WorkDaysApi from '../apis/workDaysApi.ts';

interface WorkDayElementProps {
    workDay: WorkDay,
    currentDate: Date;
    isValid: boolean;
    onInput: (updatedWorkDay: WorkDay) => void,
}

export default function WorkDayElement(props: WorkDayElementProps) {

    const [isLocked, setIsLocked] = useState<boolean>(isPastDay(props.workDay, props.currentDate))

    const onStartTimeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        onTimeInput(props.workDay.updateStartTime(WorkTimestamp.fromString(e.target.value)), props.onInput);

    const onFinishTimeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        onTimeInput(props.workDay.updateFinishTime(WorkTimestamp.fromString(e.target.value)), props.onInput)

    const classNames = [styles.column, styles.masterContainer]

    if (props.isValid === false) {
        classNames.push(styles.invalid)
    }
    else if (isLocked)
        classNames.push(styles.locked)

    return (
        <div className={classNames.join(" ")}>
            <div className={styles.dayLabelContainer}>
                <label className={styles.dayLabel}>{getLabel(props.workDay)}</label>
                <button className={styles.lockButton} type='button' style={(isLocked) ? {} : { display: 'none' }} onClick={_ => setIsLocked(false)}>
                    <i className={`${styles.padlockIcon} fa-solid fa-lock`}></i>
                </button>
            </div>

            <input type="time" className={styles.timeInput} readOnly={isLocked} onInput={onStartTimeInput}
                defaultValue={props.workDay.startTime?.toString()} />
            <input type="time" className={styles.timeInput} readOnly={isLocked} onInput={onFinishTimeInput}
                defaultValue={props.workDay.finishTime?.toString()} />
            <label className={styles.workedHours}>{getWorkedHours(props.workDay)}</label>
        </div>
    )
}

async function onTimeInput(
    workDay: WorkDay,
    onInput: (updatedWorkDay: WorkDay) => void) {
    onInput(workDay)
    await new WorkDaysApi().saveWorkDay(workDay)
}

function getWorkedHours(workDay: WorkDay): string {
    const workTimeDuration = workDay.getWorkingTime()
    if (workTimeDuration === undefined)
        return '-'
    return workTimeDuration.toString()
}

function getLabel(workDay: WorkDay): string {
    return workDay.getShortWeekDayName() + ' ' + workDay.date.getDate()


}
function isPastDay(workDay: WorkDay, currentDate: Date): boolean {
    if (workDay.date.getFullYear() < currentDate.getFullYear()) return true;
    if (workDay.date.getMonth() < currentDate.getMonth()) return true
    if (workDay.date.getDate() < currentDate.getDate()) return true
    return false
}
