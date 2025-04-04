import styles from './CurrentWeekElement.module.css'
import { useState, useEffect } from 'react'
import WorkDayElement from './WorkDayElement.tsx'
import { CurrentWeek, getCurrentWeek } from './models.ts'
import { WorkTimeDuration } from '../common/models.ts'
import CurrentWeekErrorsElement from './CurrentWeekErrorsElement.tsx'

export default function CurrentWeekElement() {

    const [currentWeek, setCurrentWeek] = useState<CurrentWeek>()

    useEffect(() => {
        getCurrentWeek().then(weekTime => setCurrentWeek(weekTime))
    }, [])

    const currentDate = new Date()

    return (
        <div className={styles.flexColumn}>
            <div className={styles.flexRow}>
                <div className={styles.startFinishLabels}>
                    <label className={styles.timeLabel}>Start Time</label>
                    <label className={styles.timeLabel}>Finish Time</label>
                    <label className={styles.hoursWorked}>Hours Worked</label>
                </div>

                {(currentWeek?.toArray() ?? [])
                    .map((workDay, dayIndex) => (
                        <WorkDayElement
                            key={dayIndex + 1}
                            workDay={workDay}
                            currentDate={currentDate}
                            isValid={workDay.error === undefined}
                            onInput={updatedWorkDay => {
                                setCurrentWeek(currentWeek!.update(updatedWorkDay))
                            }}
                        />
                    ))}
            </div>
            <label className={styles.remainingTime}>Remaining time: {calculateRemeainingTime(currentWeek)}</label>
            <CurrentWeekErrorsElement workDays={currentWeek?.toArray()} />
        </div>
    )
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
