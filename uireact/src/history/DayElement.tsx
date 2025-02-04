import { CSSProperties } from "react";
import { WorkDay } from "../common/models"
import styles from './DayElement.module.css'

interface DayElementProps {
    workDay: WorkDay
    currentDate: Date
    style: CSSProperties | undefined;
}

export default function DayElement(props: DayElementProps) {

    const styleClass =
        isInvalid(props.workDay) ? styles.invalid
            : isWeekend(props.workDay) ? styles.weekend
                : isCurrentDay(props.workDay, props.currentDate) ? styles.currentDay
                    : isFutureDay(props.workDay, props.currentDate) ? styles.futureDate
                        : isOutOfOfficeDay(props.workDay) ? styles.freeDay
                            : styles.regularPastDay
    return (
        <div className={`${styles.dayContainer} ${styleClass}`} style={props.style}>
            <label className={styles.dayLabel}>{getDayLabel(props.workDay)}</label>
            <label className={styles.dayLabel}>{getWorkedHours(props.workDay, props.currentDate)}</label>
        </div>
    )
}

function isInvalid(workDay: WorkDay) { return workDay.error !== undefined }

function isWeekend(workDay: WorkDay) { return workDay.dayOfWeek >= 6 }

function isCurrentDay(workDay: WorkDay, currentDate: Date) {
    return currentDate.getFullYear() === workDay.date.getFullYear()
        && currentDate.getMonth() === workDay.date.getMonth()
        && currentDate.getDate() === workDay.date.getDate()
}

function isFutureDay(workDay: WorkDay, currentDate: Date) {
    if (workDay.date.getFullYear() > currentDate.getFullYear()) return true
    if (workDay.date.getFullYear() < currentDate.getFullYear()) return false
    if (workDay.date.getMonth() > currentDate.getMonth()) return true;
    if (workDay.date.getMonth() < currentDate.getMonth()) return false;
    if (workDay.date.getDate() > currentDate.getDate()) return true;
    return false
}

function isOutOfOfficeDay(workDay: WorkDay) { return workDay.getWorkingTime() === undefined }

function getDayLabel(workDay: WorkDay) {
    return workDay.getShortWeekDayName() + ' ' + workDay.date.getDate()
}

function getWorkedHours(workDay: WorkDay, currentDate: Date) {
    if (isWeekend(workDay) || isFutureDay(workDay, currentDate))
        return ''

    const workingTime = workDay.getWorkingTime()
    return workingTime === undefined || workingTime.minutes === 0 ? '-' : workingTime.toString()
}
