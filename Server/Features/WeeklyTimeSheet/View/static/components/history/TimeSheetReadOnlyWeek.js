export default class TimeSheetReadOnlyWeek extends HTMLElement {
    constructor() { super() }

    get days() { return this._days }
    set days(value) { this._days = value }

    connectedCallback() {
        this.innerHTML = `
            <div class='read-only-week-container'>

            </div>

            <style>
                .read-only-week-container {
                    display: flex;
                    flex-direction: row;
                }
            </style>
        `
        const container = this.getElementsByClassName('read-only-week-container')[0]
        this.days.forEach(day => {
            const timeSheetDay = document.createElement('time-sheet-read-only-day')
            timeSheetDay.day = day
            container.appendChild(timeSheetDay)
        })
    }

}
