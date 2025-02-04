import { useState } from 'react'

export interface MonthPickerProps {
    defaultValue: Month | undefined;
    onInput: (month: Month) => void;
    className: string | undefined;
}

export default function MonthPicker(props: MonthPickerProps) {
    const [month, setMonth] = useState<Month | undefined>(props.defaultValue)

    return (
        <div className={props.className}>
            <label htmlFor='month'>Month</label>
            <input id='month'
                defaultValue={toDefaultValue(props.defaultValue)}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => onInputPrivate(e, month, setMonth)}
                type="month" />
        </div>
    )
}

function onInputPrivate(e: React.ChangeEvent<HTMLInputElement>, currentMonth: Month | undefined, setMonth: (month: Month) => void) {
    const split = e.target.value.split('-')
    const month = Number.parseInt(split[1])
    const year = Number.parseInt(split[0])
    const updatedMonth = currentMonth === undefined
        ? new Month(month, year)
        : currentMonth.update(month, year)
    setMonth(updatedMonth)
    return updatedMonth
}

function toDefaultValue(month: Month | undefined) {
    return month === undefined ? undefined : month.year + '-' + month.month
}

export class Month {
    private _month: number;
    private _year: number;

    public get month() { return this._month }
    public get year() { return this._year }

    constructor(month: number, year: number) {
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
}
