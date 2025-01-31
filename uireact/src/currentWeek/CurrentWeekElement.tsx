import './CurrentWeekElement.css'
import { useState, useEffect, useReducer } from 'react'
import { getCurrentWeekTime } from '../api/api.ts'
import WorkDayElement from './WorkDayElement.tsx'
import { CurrentWeek, WorkTimeDuration, WorkDay, DayErrors } from './models.ts'
import CurrentWeekErrorsElement from './CurrentWeekErrorsElement.tsx'

export default function CurrentWeekElement() {

    const [currentWeek, setCurrentWeek] = useState<CurrentWeek>()
    const [dayErrors, dispatchDayError] = useReducer(
        (dayErrors: DayErrors, event: DayErrorEvent) => dayErrors.update(event.workDay, event.error),
        new DayErrors([]))

    useEffect(() => {
        getCurrentWeekTime().then(weekTime => setCurrentWeek(weekTime))
    }, [])

    const currentDate = new Date()

    return (
        <div className='flex-column'>
            <div className="flex-row">
                <div className="startFinishLabels">
                    <label className="timeLabel">Start Time</label>
                    <label className="timeLabel">Finish Time</label>
                    <label className="hoursWorked">Hours Worked</label>
                </div>

                {(currentWeek?.toArray() ?? [])
                    .map((workDay, dayIndex) => (
                        <WorkDayElement
                            key={dayIndex + 1}
                            workDay={workDay}
                            currentDate={currentDate}
                            onError={(workDay, error) => {
                                dispatchDayError({ workDay: workDay, error: error })
                            }}
                        />
                    ))}
            </div>
            <label className='remainingTime'>Remaining time: {calculateRemeainingTime(currentWeek)}</label>
            <CurrentWeekErrorsElement errors={dayErrors} />
        </div>
    )
}

interface DayErrorEvent{
    workDay: WorkDay;
    error: string | undefined;
}


function calculateRemeainingTime(currentWeekTime: CurrentWeek | undefined): string {
    if (currentWeekTime === undefined)
        return '';

    const allWorkedTime = currentWeekTime
        .toArray()
        .map(day => day.getWorkingTime()?.minutes ?? 0)
        .reduce((allTime, dayTime) => allTime + dayTime, 0)

    const fullWeekWorkTime = 40 * 60;
    const remainingTimeMinutes = fullWeekWorkTime - allWorkedTime;
    return new WorkTimeDuration(remainingTimeMinutes).toString();
}
