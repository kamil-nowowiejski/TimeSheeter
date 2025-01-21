export default class TimeSheetReadOnlyDay extends HTMLElement {
    constructor() { super() }

    get startTime() { return this._startTime; }
    set startTime(value) { this._startTime = value }

    get finishTime() { return this._finishTime }
    set finishTime(value) { this._finishTime = value }

    get label() { return this._label }
    set label(value) { return this._label = value }

    connectedCallback() {
        this.innerHTML = `
            <div>
                <label>${this.label}</label>
                <label>${this.startTime}</label>
                <label>${this.finishTime}</label>
            </div>
        `
    }
}
