import { getShortDayName } from '../../helpers/dayNames.js'
import { getTimeDifferenceInMinutes, timeInMinutesToString } from '../../helpers/timeHelpers.js'

export default class TimeSheetReadOnlyDay extends HTMLElement {
    constructor() { super() }

    get day() { return this._day }
    set day(value) { this._day = value }

    connectedCallback() {
        if (this.day === undefined) {
            this.createEmptyDayHTML()
        }
        else {
            this.createDayHTML()
        }
    }

    createDayHTML() {
        this.innerHTML = `
                <div class='day-container '>
                    <label class='day-label'>${this.getDayLabel()}</label>
                    <label class='day-label'>${this.getWorkedHours()}</label>
                </div>

                <style>
                    .day-container{
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        margin: 10px;
                        height: 60px;
                        border-style: solid;
                        border-width: 2px;
                        border-color: grey;
                        border-radius: 5px;
                    }

                    .weekend {
                        background-color: lightGray;
                    }

                    .free-day{
                        background-color: moccasin;
                    }
                     
                    .regular-past-day{
                        background-color: paleGreen;
                    }
                     
                    .current-day{
                        background-color: whiteSmoke;
                        border-color: plum;
                        border-style: outset;
                        border-width: 5px;
                    }

                    .future-day{
                        background-color: whiteSmoke;
                    }

                    .day-label {
                        padding: 5px;
                        text-align: center;
                    }
                </style>
            `
        const dayContainer = this.getElementsByClassName('day-container')[0]
        const currentDay = new Date()
        const thisDay = this.day.date
        const styleClass = this.isWeekend()
            ? 'weekend'
            : isPresentDay()
                ? 'current-day'
                : isFutureDay()
                    ? 'future-day'
                    : this.hasNoHours()
                        ? 'free-day'
                        : 'regular-past-day'

        dayContainer.classList.add(styleClass)

        function isPresentDay() {
            return currentDay.getFullYear() === thisDay.getFullYear()
                && currentDay.getMonth() === thisDay.getMonth()
                && currentDay.getDate() === thisDay.getDate()
        }

        function isFutureDay() {
            if (thisDay.getFullYear() > currentDay.getFullYear()) return true
            if (thisDay.getFullYear() < currentDay.getFullYear()) return false
            if (thisDay.getMonth() > currentDay.getMonth()) return true;
            if (thisDay.getMonth() < currentDay.getMonth()) return false;
            if (thisDay.getDate() > currentDay.getDate()) return true;
            return false
        }
    }

    createEmptyDayHTML() {

        this.innerHTML = `
                <div class='empty-day'>
                </div>  

                <style>
                    .empty-day{
                        height: 60px;
                        margin: 10px;
                    }
                </style>
            `
    }

    getDayLabel() {
        return getShortDayName(this.day.date.getDay()) + ' ' + this.day.date.getDate()
    }

    isWeekend() {
        const dayOfWeek = this.day.date.getDay()
        return dayOfWeek === 0 || dayOfWeek === 6
    }

    getWorkedHours() {
        if (this.isWeekend())
            return ''

        const workedTimeInMinutes = getTimeDifferenceInMinutes(this.day?.startTime, this.day?.finishTime)
        return timeInMinutesToString(workedTimeInMinutes)
    }

    hasNoHours() {
        const workedTimeInMinutes = getTimeDifferenceInMinutes(this.day?.startTime, this.day?.finishTime)
        return workedTimeInMinutes === undefined || workedTimeInMinutes === 0
    }
}   
