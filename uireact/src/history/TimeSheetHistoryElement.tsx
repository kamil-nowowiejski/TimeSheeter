import styles from './TimeSheetHistoryElement.module.css'
import MonthPicker from '../common/MonthPickerElement.tsx'
import { Month } from '../common/MonthPickerElement.tsx'
import AggregatedStats from './AggregatedStatsElement.tsx'
import { useEffect, useState } from 'react'
import { getHistory } from './api.ts'
import { MonthHistory, WeekHistory } from './models.ts'
import { WorkTimeDuration } from '../common/models.ts'


export default function TimeSheetHistoryElement() {
    const [month, setMonth] = useState<Month>(getCurrentMonth())
    const [monthHistory, setMonthHistory] = useState<MonthHistory>()

    useEffect(() => { fetchHistory(month, setMonthHistory) }, [month])
    const [weeksGrid, lastRow] = getWeeksGrid(monthHistory)
    const weekTotalWorkTime = getWeekTotalWorkTime(monthHistory)


    return (
        <div>
            <MonthPicker className={styles.monthPicker} onInput={m => setMonth(m)} defaultValue={month} />

            <div className={styles.weeksContainer}>
                
                {weeksGrid}
                <div className={styles.verticalBorder} style={{ gridRowStart: 1, gridRowEnd: lastRow }}></div>
                <label className={styles.totalHoursHeader}>Total</label>
                {weekTotalWorkTime}

            </div>

            <AggregatedStats />
        </div>
    )
}

function getCurrentMonth() {
    const currentDate = new Date();
    return new Month(currentDate.getMonth(), currentDate.getFullYear())
}

async function fetchHistory(month: Month, setMonthHistory: (history: MonthHistory) => void) {
    const firstDay = month.getDate(1)
    const lastDay = month.getDate(0)
    const history = await getHistory(firstDay, lastDay)
    setMonthHistory(history)
}

function getWeekWorkTime(week: WeekHistory) {
    const workTimeMinutes = week.days.reduce((total, current) => {
        total += current?.getWorkingTime()?.minutes ?? 0
        return total
    }, 0)
    const duration = new WorkTimeDuration(workTimeMinutes)
    return duration.toString()
}

function getWeeksGrid(monthHistory: MonthHistory | undefined): [JSX.Element[], number] {

    const weeks: WeekHistory[] = monthHistory?.weeks ?? []
    const days = []
    let row = 2
    for (const week of weeks) {
        let column = 1
        for (const day of week.days) {
            const dayElement = (
                <label
                    key={getKey(row, column)}
                    style={{ gridColumn: column, gridRow: row }}>
                        {day?.dayOfWeek??'nie wiem'}                    
                </label>)
            days.push(dayElement)
            column++
        }
        row++
    }

    return [days, row]

    function getKey(row: number, column: number) { return `D${row}-${column}` }
}

function getWeekTotalWorkTime(monthHistory: MonthHistory | undefined) {

    const weeks = monthHistory?.weeks ?? []
    const totals = []
    let weekIndex = 1
    for (const week of weeks) {
        const total = (
            <label
                key={getKey(weekIndex)}
                style={{ gridColumn: 9, gridRow: weekIndex + 1 }}
                className={styles.weeklyHours}>
                {getWeekWorkTime(week)}
            </label>
        )
        totals.push(total)
        weekIndex++
    }
    return totals

    function getKey(index: number) { return `W${index}` }
}
