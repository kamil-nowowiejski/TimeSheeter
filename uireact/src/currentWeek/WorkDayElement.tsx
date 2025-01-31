import './WorkDayElement.css'
import { useState } from 'react'
import { getShortDayName } from '../helpers/dayNames.ts'
import { saveTime } from '../api/api';
import { WorkDay, WorkTimestamp } from './models.ts';

interface WorkDayElementProps {
    workDay: WorkDay,
    currentDate: Date;
    onError: (workDay: WorkDay, error: string | undefined) => void;
}

export default function WorkDayElement(props: WorkDayElementProps) {

    const [workDay, setWorkDay] = useState<WorkDay>(props.workDay)
    const [isLocked, setIsLocked] = useState<boolean>(props.workDay.dayIndex < props.currentDate.getDay())
    const [validationError, setValidationError] = useState<string | undefined>(getValidationError(workDay))

    const onStartTimeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        onTimeInput(workDay.updateStartTime(WorkTimestamp.fromString(e.target.value)), setWorkDay, setValidationError, props.onError);

    const onFinishTimeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        onTimeInput(workDay.updateFinishTime(WorkTimestamp.fromString(e.target.value)), setWorkDay, setValidationError, props.onError)

    const classNames = ['column', 'masterContainer']

    if (validationError !== undefined) {
        classNames.push('invalid')
        props.onError(workDay, validationError)
    }
    else if (isLocked)
        classNames.push('locked')

    return (
        <div className={classNames.join(" ")}>
            <div className='dayLabelContainer'>
                <label className='dayLabel'>{getLabel(props.workDay.dayIndex, props.currentDate)}</label>
                <button className='lockButton' type='button' style={(isLocked) ? {} : { display: 'none' }} onClick={_ => setIsLocked(false)}>
                    <i className="padlockIcon fa-solid fa-lock"></i>
                </button>
            </div>

            <input type="time" className="timeInput" readOnly={isLocked} onInput={onStartTimeInput} />
            <input type="time" className="timeInput" readOnly={isLocked} onInput={onFinishTimeInput} />
            <label className='workedHours'>{getWorkedHours(workDay)}</label>
        </div>
    )
}

async function onTimeInput(
    workDay: WorkDay,
    setWorkDay: (workDay: WorkDay) => void,
    setValidationError: (error: string | undefined) => void,
    onErrorCallback: (workDay: WorkDay, error: string | undefined) => void) {

    setWorkDay(workDay)
    validateTime(workDay, setValidationError, onErrorCallback)
    // await saveTime()
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

function validateTime(
    workDay: WorkDay,
    setValidationError: (error: string | undefined) => void,
    onErrorCallback: (workDay: WorkDay, error: string | undefined) => void): void {

    const error = getValidationError(workDay)
    setValidationError(error)
    onErrorCallback(workDay, error)
}

function getValidationError(workDay: WorkDay): string | undefined {

    if (workDay.startTime === undefined || workDay.finishTime === undefined)
        return undefined

    if (workDay.finishTime.minutes <= workDay.finishTime.minutes)
        return 'Finish time must be greater than start time'

    return undefined
}
