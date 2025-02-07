export class WorkTimestamp {
    private _time: number;

    public get minutes(): number { return this._time; }

    constructor(timeInMinutes: number) { this._time = timeInMinutes; }

    /**
     * @param timeString - acceptable format is 'hh:mm'
     **/
    public static fromString(timeString: string | undefined): WorkTimestamp | undefined {
        if (timeString === undefined || timeString === '' || timeString === null)
            return undefined;

        return new WorkTimestamp(this.convertTimeToMinutes(timeString));
    }

    /**
    * @param minutes - minutes since midnight
    **/
    public static fromMinutes(minutes: number) { return new WorkTimestamp(minutes); }
    public toString(): string { return timeInMinutesToString(this._time); }

    private static convertTimeToMinutes(stringTime: string): number {
        const split = stringTime.split(':');
        const hours = parseInt(split[0])
        const minutes = parseInt(split[1])
        return hours * 60 + minutes;

    }
}

export class WorkDay {
    private _date: Date;
    private _startTime: WorkTimestamp | undefined;
    private _finishTime: WorkTimestamp | undefined
    private _error: string | undefined;

    public get date() { return this._date }
    public get dayOfWeek() {
        const jsDay = this._date.getDay()
        return jsDay === 0 ? 7 : jsDay;
    }

    public get startTime() { return this._startTime }
    public get finishTime() { return this._finishTime }
    public get error() { return this._error }

    constructor(
        date: Date,
        startTime: WorkTimestamp | undefined,
        finishTime: WorkTimestamp | undefined) {
        this._date = date
        this._startTime = startTime
        this._finishTime = finishTime
        this._error = this.getValidationError()
    }

    public updateStartTime(time: WorkTimestamp | undefined) {
        return new WorkDay(this.date, time, this.finishTime)
    }

    public updateFinishTime(time: WorkTimestamp | undefined) {
        return new WorkDay(this.date, this.startTime, time)
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
        switch (this.dayOfWeek) {
            case 1: return "Monday"
            case 2: return "Tuesday"
            case 3: return "Wendsday"
            case 4: return "Thursday"
            case 5: return "Friday"
            case 6: return 'Saturday'
            case 7: return 'Sunday'
        }

        throw "Invalid day index";
    }

    public getShortWeekDayName() {
        switch (this.dayOfWeek) {
            case 1: return "Mon";
            case 2: return "Tu";
            case 3: return "Wen";
            case 4: return "Thu";
            case 5: return "Fri";
            case 6: return 'Sat';
            case 7: return 'Sun'
        }

        throw "Invalid day index"
    }

    private getValidationError(): string | undefined {

        if (this.startTime === undefined || this.finishTime === undefined)
            return undefined

        if (this.finishTime.minutes <= this.startTime.minutes)
            return 'Finish time must be greater than start time'

        return undefined
    }
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

export class Earnings {
    private _earningsPerHour: number;
    private _currency: string;

    public get earningsPerHour() { return this._earningsPerHour }
    public get currency() { return this._currency }

    constructor(earningsPerHour: number, currency: string) {
        this._currency = currency;
        this._earningsPerHour = earningsPerHour
    }

}

export class Month {
    private _month: number;
    private _year: number;

    public get month() { return this._month }
    public get year() { return this._year }

    constructor(month: number, year: number) {
        this.validateMonth(month)
        this.validateYear(year)
        this._month = month;
        this._year = year
    }

    public getDate(day: number): Date {
        if (day > 0) {
            const stringDate = this.year + '-' + this.month + '-' + day
            return new Date(Date.parse(stringDate))
        }

        return new Date(this.year, this.month, day)
    }

    public update(month: number, year: number): Month {
        if (this.month == month && this.year == year)
            return this
        return new Month(month, year)
    }

    private validateMonth(month: number) {
        if (month >= 1 && month <= 12)
            return
        throw new Error("Month value is invalid: " + month);
    }
    private validateYear(year: number) {
        if (year >= 1)
            return
        throw new Error("Year value is invalid: " + year);
    }
}
function timeInMinutesToString(workTimeMinutes: number): string {
    const workHours = Math.floor(workTimeMinutes / 60);
    const workMinutes = workTimeMinutes - workHours * 60;
    const hoursString = String(workHours).padStart(2, '0')
    const minutesString = String(workMinutes).padStart(2, '0')
    return hoursString + ":" + minutesString;
}
