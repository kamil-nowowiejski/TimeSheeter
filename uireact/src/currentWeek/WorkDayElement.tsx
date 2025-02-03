import styles from './WorkDayElement.module.css'
import { useState } from 'react'
import { getShortDayName } from '../helpers/dayNames.ts'
import { saveTime } from '../api/api';
import { WorkDay, WorkTimestamp } from './models.ts';

interface WorkDayElementProps {
    workDay: WorkDay,
    currentDate: Date;
    isValid: boolean;
    onInput: (updatedWorkDay: WorkDay) => void,
}

export default function WorkDayElement(props: WorkDayElementProps) {

    const [isLocked, setIsLocked] = useState<boolean>(props.workDay.dayIndex < props.currentDate.getDay())

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
                <label className={styles.dayLabel}>{getLabel(props.workDay.dayIndex, props.currentDate)}</label>
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
    await saveTime(workDay)
}

function getWorkedHours(workDay: WorkDay): string {
    const workTimeDuration = workDay.getWorkingTime()
    if (workTimeDuration === undefined)
        return '-'
    return workTimeDuration.toString()
}

function getLabel(dayIndex: number, currentDate: Date): string {
    const dateForDayIndex = getDateForDayOfWeek(dayIndex, currentDate);
    const dayOfWeekLabel = getShortDayName(dayIndex);
    return dayOfWeekLabel + " " + dateForDayIndex.getDate();
}

function getDateForDayOfWeek(dayIndex: number, currentDate: Date): Date {
    const currentDay = currentDate.getDay();
    const dayDifference = dayIndex - currentDay;
    const timeDifference = dayDifference * 1000 * 60 * 60 * 24;
    return new Date(currentDate.getTime() + timeDifference);
}
