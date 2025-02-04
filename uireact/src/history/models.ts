import { WorkDay } from "../common/models";

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
