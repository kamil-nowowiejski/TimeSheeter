import { convertTimeToMinutes, timeInMinutesToString } from "../helpers/timeHelpers";
import { getShortDayName, getLongDayName } from '../helpers/dayNames.ts'

export class WorkDay {
    private _dayIndex: number;
    private _startTime: WorkTimestamp | undefined;
    private _finishTime: WorkTimestamp | undefined
    private _error: string | undefined;

    public get dayIndex() { return this._dayIndex; }
    public get startTime() { return this._startTime }
    public get finishTime() { return this._finishTime }
    public get error() { return this._error }

    constructor(
        dayIndex: number,
        startTime: WorkTimestamp | undefined,
        finishTime: WorkTimestamp | undefined) {
        this._dayIndex = dayIndex
        this._startTime = startTime
        this._finishTime = finishTime
        this._error = this.getValidationError()
    }

    public updateStartTime(time: WorkTimestamp | undefined) {
        return new WorkDay(this._dayIndex, time, this._finishTime)
    }

    public updateFinishTime(time: WorkTimestamp | undefined) {
        return new WorkDay(this._dayIndex, this._startTime, time)
    }

    /**
     * Returns time in minutes
     **/
    public getWorkingTime(): WorkTimeDuration | undefined {
        if (this._startTime === undefined || this._finishTime === undefined)
            return undefined

        if (this._finishTime.minutes <= this._startTime.minutes)
            return undefined

        const minutes = this._finishTime.minutes - this._startTime.minutes
        return new WorkTimeDuration(minutes)
    }

    public getLongWeekDayName() {
        return getLongDayName(this._dayIndex)
    }

    public getShortWeekDayName() {
        return getShortDayName(this._dayIndex)
    }

    private getValidationError(): string | undefined {

        if (this.startTime === undefined || this.finishTime === undefined)
            return undefined

        if (this.finishTime.minutes <= this.startTime.minutes)
            return 'Finish time must be greater than start time'

        return undefined
    }
}

export class WorkTimestamp {
    private _time: number;

    public get minutes(): number { return this._time }

    constructor(timeInMinutes: number) { this._time = timeInMinutes }

    /**
     * @param timeString - acceptable format is 'hh:mm'
     **/
    public static fromString(timeString: string | undefined): WorkTimestamp | undefined {
        if (timeString === undefined || timeString === '' || timeString === null)
            return undefined

        return new WorkTimestamp(convertTimeToMinutes(timeString))
    }

    /**
    * @param minutes - minutes since midnight
    **/
    public static fromMinutes(minutes: number) { return new WorkTimestamp(minutes) }
    public toString(): string { return timeInMinutesToString(this._time) }
}

export class WorkTimeDuration {
    private _time: number;
    constructor(timeInMinutes: number) {
        this._time = timeInMinutes
    }
    public get minutes() { return this._time; }
    public toString(): string {
        return timeInMinutesToString(this._time)
    }
}
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
        updatedDays[updatedDay.dayIndex - 1] = updatedDay
        return new CurrentWeek(updatedDays[0], updatedDays[1], updatedDays[2], updatedDays[3], updatedDays[4])
    }
}
