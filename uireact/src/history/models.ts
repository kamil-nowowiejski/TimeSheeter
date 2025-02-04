import { WorkDay, Earnings, Month } from "../common/models";
import EarningsApi from "../apis/earningsApi";
import WorkDaysApi from "../apis/workDaysApi";

export class MonthHistory {
    private _weeks: WeekHistory[]
    private _earnings: Earnings;

    public get weeks() { return [...this._weeks] }
    public get earnings() { return this._earnings }

    constructor(weeks: WeekHistory[], earnings: Earnings) {
        this._weeks = weeks;
        this._earnings = earnings;
    }

}

export class WeekHistory {
    private _days: (WorkDay | undefined)[]

    /**
    * The days collection always has 7 elements.
    * The collection starts from Monday.
    * Week can miss some days at the begging or at the end. 
    * Such days are depicted as undefined.
    */
    public get days() { return [...this._days] }

    constructor(days: (WorkDay | undefined)[]) {
        this._days = days
    }
}

export async function getMonthHistory(month: Month) {
    const firstDay = month.getDate(1)
    const lastDay = month.getDate(0)
    const recordedWorkDays = await new WorkDaysApi().getWorkDays(firstDay, lastDay)
    const allDaysInMonth = getAllDaysInMonth(firstDay, lastDay, recordedWorkDays)
    const weeks = splitDaysIntoWeeks(allDaysInMonth)

    const earnings = await new EarningsApi().get()

    return new MonthHistory(weeks, earnings)
}

function getAllDaysInMonth(firstDay: Date, lastDay: Date, recordedWorkDays: WorkDay[]): WorkDay[] {
    const allDays: WorkDay[] = []

    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
        let thisWorkDay = recordedWorkDays.find(dt => dt.date.getDate() === i)
        if (thisWorkDay === undefined) {
            const stringDay = firstDay.getFullYear() + '-' + (firstDay.getMonth() + 1) + '-' + i
            const dayDate = new Date(stringDay)
            thisWorkDay = new WorkDay(dayDate, undefined, undefined)
        }

        allDays.push(thisWorkDay)
    }

    return allDays
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
