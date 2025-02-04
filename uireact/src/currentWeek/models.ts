import {  WorkDay } from "../common/models.ts";


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
