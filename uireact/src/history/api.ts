import { Earnings, MonthHistory, WeekHistory } from './models.ts'
import { WorkDay, WorkTimestamp } from '../common/models.ts'

export async function getHistory(firstDay: Date, lastDay: Date): Promise<MonthHistory> {
    const dto = await getHistoryDto(firstDay, lastDay)
    const weeksHistory = getWeeksHistory(firstDay, lastDay, dto.days)
    const earnings = new Earnings(dto.earnings.earningsPerHour, dto.earnings.currency)
    return new MonthHistory(weeksHistory, earnings)
}

async function getHistoryDto(firstDay: Date, lastDay: Date): Promise<HistoryDto> {

    if (firstDay === undefined || lastDay === undefined)
        return Promise.reject(new Error('first and last day must be defined'))

    const url = '/timesheethistory?' + new URLSearchParams({
        minDate: toDateString(firstDay),
        maxDate: toDateString(lastDay)
    });

    return await fetch(url)
        .then(response => response.text())
        .then(json => JSON.parse(json))
}

function toDateString(date: Date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function getWeeksHistory(firstDay: Date, lastDay: Date, dayDtos: HistoryDayDto[]) {
    const days = getDays(firstDay, lastDay, dayDtos)
    return splitDaysIntoWeeks(days)
}


function getDays(firstDay: Date, lastDay: Date, dayDtos: HistoryDayDto[]): WorkDay[] {
    const allDays: WorkDay[] = []
    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
        const stringDay = firstDay.getFullYear() + '-' + (firstDay.getMonth() + 1) + '-' + i
        const dayDate = new Date(stringDay)
        const dto = dayDtos.find(dt => areEqual(dayDate, dt.date))
        const day = new WorkDay(dayDate, WorkTimestamp.fromString(dto?.startTime), WorkTimestamp.fromString( dto?.finishTime ))
        allDays.push(day)

    }

    return allDays

    function areEqual(a: Date, b: string) {
        const bDate = new Date(Date.parse(b))
        return a.getDate() === bDate.getDate() && a.getMonth() === bDate.getMonth() && a.getFullYear() === bDate.getFullYear()
    }
}


function splitDaysIntoWeeks(days: WorkDay[]): WeekHistory[] {
    const weeks: WeekHistory[] = []
    const allDays = days.slice()

    while (allDays.length > 0) {
        const currentWeek = [allDays.shift()]
        const beginWeekDay = currentWeek[0]!.date.getDay()
        const daysToTake = beginWeekDay === 0 ? 0 : 7 - beginWeekDay
        for (let i = 0; i < daysToTake; i++) {
            currentWeek.push(allDays.shift())
        }

        const emptyDaysToFill = beginWeekDay === 0 ? 6 : beginWeekDay - 1
        for (let i = 0; i < emptyDaysToFill; i++) {
            currentWeek.unshift(undefined)
        }

        weeks.push(new WeekHistory(currentWeek))
    }

    return weeks
}

interface HistoryDto {
    earnings: EarningsDto;
    days: HistoryDayDto[];
}

interface EarningsDto {
    earningsPerHour: number;
    currency: string;
}

interface HistoryDayDto {
    date: string;
    startTime: string;
    finishTime: string;
}
