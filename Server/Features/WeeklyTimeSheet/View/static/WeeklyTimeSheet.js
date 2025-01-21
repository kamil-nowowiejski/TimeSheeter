import TimeSheetTable from './components/TimeSheetTable.js';
import TimeSheetDay from './components/TimeSheetDay.js';
import TimeSheetMenu from './components/timeSheetMenu.js'

customElements.define('time-sheet-day', TimeSheetDay)
customElements.define('time-sheet-table', TimeSheetTable);
customElements.define('time-sheet-menu', TimeSheetMenu)

class WeeklyTimeSheet extends HTMLElement {
    constructor() { super() }

    connectedCallback() {
        this.innerHTML = `
            <div class="flex-row">
                <time-sheet-menu class='fixed-menu'></time-sheet-menu>
                <time-sheet-table class='time-sheet-table'></time-sheet-table>
            </div>  

            <style>
                .flex-row {
                    dispaly: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    width: 100%;
                    height: 100%;
                }

                .fixed-menu {
                    height: 100vh; 
                    background-image: linear-gradient(to left, lightCyan, darkTurquoise);
                }

                .time-sheet-table {
                    margin-top: 8px;
                    margin-left: 8px;
                }
            </style>
`

    }
}

customElements.define('weekly-time-sheet', WeeklyTimeSheet)
