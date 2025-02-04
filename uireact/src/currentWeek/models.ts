import { WorkDay } from "../common/models.ts";
import WorkDaysApi from '../apis/workDaysApi.ts'


export class CurrentWeek {
    constructor(monday: WorkDay, tuesday: WorkDay, wendsday: WorkDay, thrusday: WorkDay, friday: WorkDay) {
        this._days = [monday, tuesday, wendsday, thrusday, friday]
    }
    _days: WorkDay[];

    toArray(): WorkDay[] { return this._days.map(d => d) }

    getDay(dayIndex: number): WorkDay {
        if (dayIndex < 1 || dayIndex > 5)
            throw "Invalid day index"
        return this._days[dayIndex - 1]
    }

    update(updatedDay: WorkDay): CurrentWeek {
        const updatedDays = this.toArray()
        updatedDays[updatedDay.dayOfWeek - 1] = updatedDay
        return new CurrentWeek(updatedDays[0], updatedDays[1], updatedDays[2], updatedDays[3], updatedDays[4])
    }
}


export async function getCurrentWeek() {
    const api = new WorkDaysApi()
    const currentDate = new Date()
    const [minDate, maxDate] = getMinAndMaxDates(currentDate)
    const workDays = await api.getWorkDays(minDate, maxDate)

    const currentWeekDays = convertToCurrentWeekDays(workDays, minDate, maxDate)
    return new CurrentWeek(currentWeekDays[0], currentWeekDays[1], currentWeekDays[2], currentWeekDays[3], currentWeekDays[4])
}

function getMinAndMaxDates(currentDate: Date) {
    const jsDayOfWeek = currentDate.getDay()
    const dayOfWeek = jsDayOfWeek === 0 ? 7 : jsDayOfWeek

    const minDate = new Date(currentDate.getTime())
    minDate.setDate(minDate.getDate() - dayOfWeek + 1)

    const maxDate = new Date(currentDate.getTime())
    maxDate.setDate(maxDate.getDate() + 5 - dayOfWeek)

    return [minDate, maxDate]
}

function convertToCurrentWeekDays(workDays: WorkDay[], minDate: Date, maxDate: Date) {
    const startingDay = minDate.getDate()
    const dayDifference = (maxDate.getTime() - minDate.getTime()) / 1000 / 60 / 60 / 24
    const currentWeekWorkDays = []

    for (let i = 0; i <= dayDifference; i++) {
        const curDate = new Date(minDate.getTime())
        curDate.setDate(startingDay + i)
        const workDay = workDays.find(wd => areEqual(curDate, wd.date))
            ?? new WorkDay(curDate, undefined, undefined)

        currentWeekWorkDays.push(workDay)
    }

    return currentWeekWorkDays

    function areEqual(a: Date, b: Date) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    }
}
