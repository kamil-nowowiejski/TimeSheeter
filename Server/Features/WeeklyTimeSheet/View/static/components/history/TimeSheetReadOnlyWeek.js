export default class TimeSheetReadOnlyWeek extends HTMLElement {
    constructor() { super() }

    get mondayDate() { return this._mondayDate }
    set mondayDate(value) { this._mondayDate = value }

    connectedCallback() {
        this.innerHTML = `
            <div class='read-only-week-container'>

            </div>
        `
        const container = this.getElementsByClassName('read-only-week-container')
        for (let i = 1; i < 6; i++) {
            const timeSheetDay = document.createElement('time-sheet-read-only-day')
            timeSheetDay.label = 'test label'
            timeSheetDay.startTime = 'test'
            timeSheetDay.finishTime = 'test 2'
            container.appendChild(timeSheetDay)
        }
    }
}
