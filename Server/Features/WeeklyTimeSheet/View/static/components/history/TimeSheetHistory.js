export default class TimeSheetHistory extends HTMLElement {
    constructor() { super() }

    connectedCallback() {
        this.innerHTML = `
            <div>
                <label>Month</label>
                <!-- <time-sheet-read-only-week></time-sheet-read-only-week> -->
            </div>
        `
    }
}
