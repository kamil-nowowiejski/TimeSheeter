export default class MonthPicker extends HTMLElement {
    constructor() { super() }

    get value() { return this._getMonthPicker().value }
    set value(val) { this._getMonthPicker().value = val }

    connectedCallback() {
        this.innerHTML = `
            <div class='month-picker-container'>
                <label for='month'>Month</label>
                <input id='month' type="month" class='month-picker'>
            </div>

            <style>
            </style>
        `

        this._getMonthPicker().addEventListener("input", event => {
            const newEvent = new Event("input")
            this.dispatchEvent(newEvent)
        })

    }

    _getMonthPicker() { return this.getElementsByClassName('month-picker')[0] }

}
