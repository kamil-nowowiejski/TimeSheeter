export default class TimeSheetMenu extends HTMLElement {
    constructor() { super() }

    get onCurrentWeekCallback() { return this._onCurrentWeekCallback }
    set onCurrentWeekCallback(value) { this._onCurrentWeekCallback = value }

    get onTimeSheetHistoryCallback() { return this._onTimeSheetHistoryCallback }
    set onTimeSheetHistoryCallback(value) { this._onTimeSheetHistoryCallback = value }

    connectedCallback() {
        this.innerHTML = `
            <div class="menu-container">
                <button type="button" class="menu-item current-week">
                    <i class="fa-solid fa-calendar-week fa-lg icon-style"></i>
                    Current Week
                </button>
 
                <button type="button" class="menu-item time-sheet-history">
                    <i class="fa-solid fa-clock-rotate-left fa-lg icon-style"></i>
                    Timesheet History
                </button>
            </div>

            <style>
                .menu-container {
                    display: flex;
                    flex-direction: column; 
                    flex-wrap: nowrap;
                }

                .menu-item {
                    border: single;
                    border-radius: 5px;
                    border-color: blue;  
                    padding: 10px;
                    margin: 10px 40px 10px 10px; 
                    background-color: paleTurquoise;
                    text-wrap: nowrap;
                    font-size: 14px;
                }
                
                .icon-style {
                    color: #2572ad;
                }
            </style>
            `

        const currentWeekButton = this.getElementsByClassName('current-week')[0]
        currentWeekButton.onclick = () => this.onCurrentWeekCallback()

        const historyButton = this.getElementsByClassName('time-sheet-history')[0]
        historyButton.onclick = () => this.onTimeSheetHistoryCallback()
    }
}
