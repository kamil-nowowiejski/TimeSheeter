import TimeSheetDay from './components/TimeSheetDay.js';
import TimeSheetTable from './components/TimeSheetTable.js';
import TimeSheetReadOnlyDay from './components/history/TimeSheetReadOnlyDay.js'
import TimeSheetReadOnlyWeek from './components/history/TimeSheetReadOnlyWeek.js'
import TimeSheetHistory from './components/history/TimeSheetHistory.js'
import TimeSheetMenu from './components/timeSheetMenu.js'

customElements.define('time-sheet-day', TimeSheetDay)
customElements.define('time-sheet-table', TimeSheetTable);
customElements.define('time-sheet-read-only-day', TimeSheetReadOnlyDay)
customElements.define('time-sheet-read-only-week', TimeSheetReadOnlyWeek)
customElements.define('time-sheet-history', TimeSheetHistory)
customElements.define('time-sheet-menu', TimeSheetMenu)

class WeeklyTimeSheet extends HTMLElement {
    constructor() { super() }

    connectedCallback() {
        this.innerHTML = `
            <div class="flex-row">
                <time-sheet-menu class='side-menu'></time-sheet-menu>
                <div class='content-container'>
                    <time-sheet-table class='time-sheet-table'></time-sheet-table>
                </div>
            </div>  

            <style>
                .flex-row {
                    dispaly: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    width: 100%;
                    height: 100%;
                }

                .side-menu {
                    height: 100vh; 
                    background-image: linear-gradient(to left, lightCyan, darkTurquoise);
                }

                .time-sheet-table {
                    margin-top: 8px;
                    margin-left: 8px;
                }
            </style>
            `

        const menu = this.getElementsByClassName('side-menu')[0]
        menu.onTimeSheetHistoryCallback = () => this.showElement('time-sheet-history')
        menu.onCurrentWeekCallback = () => this.showElement('time-sheet-table')
    }
    
    showElement(elementName){
        const contentContainer = this.getElementsByClassName('content-container')[0]
        contentContainer.removeChild(contentContainer.children[0])
        const element = document.createElement(elementName)
        contentContainer.appendChild(element)
    }
}

customElements.define('weekly-time-sheet', WeeklyTimeSheet)
