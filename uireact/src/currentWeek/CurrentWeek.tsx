import './CurrentWeek.css'
import { useState, useEffect } from 'react'
import { getCurrentWeekTime, CurrentWeekTime } from '../api/api.ts'
import  DayTime  from './DayTime.tsx'
import { getTimeDifferenceInMinutes, timeInMinutesToString } from '../helpers/timeHelpers.ts'

function CurrentWeek() {

    const [currentWeekTime, setCurrentWeekTime] = useState<CurrentWeekTime>()

    useEffect(() => {
        getCurrentWeekTime().then(weekTime => setCurrentWeekTime(weekTime))
    }, [])

    const times = currentWeekTime === undefined ? [] : currentWeekTime.toArray()

    const currentDate = new Date()

    return (
        <div className='flex-column'>
            <div className="flex-row">
                <div className="startFinishLabels">
                    <label className="timeLabel">Start Time</label>
                    <label className="timeLabel">Finish Time</label>
                    <label className="hoursWorked">Hours Worked</label>
                </div>

                {times.map((time, dayIndex) => (
                    <DayTime
                        key={dayIndex + 1}
                        dayIndex={dayIndex + 1}
                        startTime={time.startTime}
                        finishTime={time.finishTime}
                        currentDate={currentDate}
                        onTimeInput={(startTime, finishTime) => {
                            setCurrentWeekTime(currentWeekTime?.updateTime(dayIndex, startTime, finishTime))}}
                        onError={() => { }}
                        onErrorCleared={() => { }}
                    />
                ))}
            </div>
            <label className='remainingTime'>Remaining time: {calculateRemeainingTime(currentWeekTime)}</label>
            <div className="errors"></div>
        </div>
    )
}

function calculateRemeainingTime(currentWeekTime: CurrentWeekTime | undefined): string {
    if (currentWeekTime === undefined)
        return '';

    const allWorkedTime = currentWeekTime
        .toArray()
        .map(day => getTimeDifferenceInMinutes(day.startTime, day.finishTime))
        .reduce((allTime, dayTime) => allTime + dayTime, 0)
    const fullWeekWorkTime = 40 * 60;
    const remainingTimeMinutes = fullWeekWorkTime - allWorkedTime;

    return timeInMinutesToString(remainingTimeMinutes)
}

export default CurrentWeek
