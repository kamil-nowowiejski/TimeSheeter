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
                <div class='day-container 
                    ${this.isWeekend() ? 'weekend' : ''}
                    ${this.isWeekend() === false && this.hasNoHours() ? 'free-day' : ''}'>
                    <label class='day-label'>${this.getDayLabel()}</label>
                    <label class='day-label'>${this.getWorkedHours()}</label>
                </div>

                <style>
                    .day-container{
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        margin: 10px;
                        width: 80px;
                        height: 60px;
                    }

                    .weekend {
                        background-color: gray;
                    }

                    .free-day{
                        background-color: red;
                    }

                    .day-label {
                        padding: 5px;
                    }
                </style>
            `
    }

    createEmptyDayHTML() {

        this.innerHTML = `
                <div class='empty-day'>
                </div>  

                <style>
                    .empty-day{
                        width: 80px;
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
        const workedTimeInMinutes = getTimeDifferenceInMinutes(this.day?.startTime, this.day?.finishTime)
        return timeInMinutesToString(workedTimeInMinutes)
    }

    hasNoHours(){
        const workedTimeInMinutes = getTimeDifferenceInMinutes(this.day?.startTime, this.day?.finishTime)
        return workedTimeInMinutes === undefined || workedTimeInMinutes === 0
    }
}   
