import './DayTime.css'
import { useState } from 'react'
import { getShortDayName } from '../helpers/dayNames.ts'
import { convertTimeToMinutes, timeInMinutesToString, isTimeValueUndefined } from '../helpers/timeHelpers.ts'
import { saveTime } from '../api/api';

interface DayTimeProps {
    dayIndex: number;
    startTime: string | null;
    finishTime: string | null;
    currentDate: Date;
    onTimeInput: (startTime: string | null, finishTime: string | null) => void;
    onError: () => void;
    onErrorCleared: () => void;
}

interface Time {
    startTime: string | null;
    finishTime: string | null;
}

function DayTime(props: DayTimeProps) {

    const [time, setTime] = useState<Time>({ startTime: props.startTime, finishTime: props.finishTime })
    const [isLocked, setIsLocked] = useState<boolean>(props.dayIndex < props.currentDate.getDay())

    const onStartTimeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        onTimeInput(e.target.value, null, setTime, props.onTimeInput);

    const onFinishTimeInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        onTimeInput(null, e.target.value, setTime, props.onTimeInput)

    const classNames = ['column', 'masterContainer']
    if (isLocked)
        classNames.push('locked')

    return (
        <div className={classNames.join(" ")}>
            <div className='dayLabelContainer'>
                <label className='dayLabel'>{getLabel(props.dayIndex, props.currentDate)}</label>
                <button className='lockButton' type='button' style={(isLocked) ? {} : { display: 'none' }} onClick={_ => setIsLocked(false)}>
                    <i className="padlockIcon fa-solid fa-lock"></i>
                </button>
            </div>

            <input type="time" className="timeInput" readOnly={isLocked} onInput={onStartTimeInput} />
            <input type="time" className="timeInput" readOnly={isLocked} onInput={onFinishTimeInput} />
            <label className='workedHours'>{getWorkedHours(time)}</label>

        </div>
    )
}

async function onTimeInput(
    startTime: string | null,
    finishTime: string | null,
    setTime: (time: Time) => void,
    parentCallback: (startTime: string | null, finishTime: string | null) => void) {

    const time = { startTime: startTime, finishTime: finishTime }
    setTime(time)
    parentCallback(startTime, finishTime)
    await saveTime()
}

function getWorkedHours(time: Time): string {
    if (isTimeValueUndefined(time.startTime) || isTimeValueUndefined(time.finishTime))
        return '-';

    const startTimeMinutes = convertTimeToMinutes(time.startTime);
    const finishTimeMinutes = convertTimeToMinutes(time.finishTime);

    if (finishTimeMinutes <= startTimeMinutes)
        return '-'

    const workTimeMinutes = finishTimeMinutes - startTimeMinutes;
    return timeInMinutesToString(workTimeMinutes);
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


export default DayTime
