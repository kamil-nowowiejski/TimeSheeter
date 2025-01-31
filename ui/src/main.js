import './styles.module.css'
import {  state } from './stateManager.js'
import MonthPicker from './components/monthPicker.js';
import TimeSheetDay from './components/TimeSheetDay.js';
import TimeSheetTable from './components/TimeSheetTable.js';
import TimeSheetReadOnlyDay from './components/history/TimeSheetReadOnlyDay.js'
import AggregatedStatsInfo from './components/history/AggregatedStats.js';
import AggregatedStatsInfoModal from './components/history/AggregatedStatsInfoModal.js';
import TimeSheetHistory from './components/history/TimeSheetHistory.js'
import TimeSheetMenu from './components/timeSheetMenu.js'
import InvoiceGenerator from './components/invoiceGeneration/InvoiceGenerator.js';
//fsgf
customElements.define('month-picker', MonthPicker)
customElements.define('time-sheet-day', TimeSheetDay)
customElements.define('time-sheet-table', TimeSheetTable);
customElements.define('time-sheet-read-only-day', TimeSheetReadOnlyDay)
customElements.define('aggregated-stats', AggregatedStatsInfo)
customElements.define('aggregated-stats-info-modal', AggregatedStatsInfoModal)
customElements.define('time-sheet-history', TimeSheetHistory)
customElements.define('time-sheet-menu', TimeSheetMenu)
customElements.define('invoice-generator', InvoiceGenerator)

class WeeklyTimeSheet extends HTMLElement {
    constructor() { super(); }

    connectedCallback() {
        this.innerHTML = `
            <div class="flex-row">
                <time-sheet-menu class='side-menu'></time-sheet-menu>
                <div class='content-container'>
                </div>
            </div>  

            <style>
                .flex-row {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    width: 100%;
                    height: 100%;
                }

                .content-container {
                    flex: 1;
                    margin-top: 8px;
                    margin-left: 8px;
                }

                .side-menu {
                    height: 100vh; 
                    flex-grow: 0;
                    flex-shrink: 0;
                    flex-basis: 250px;
                    background-image: linear-gradient(to left, lightCyan, darkTurquoise);
                }
            </style>
            `
        // if (stateManager.getSelectedTab() == 'time-sheet-table')
        //     this.showElement('time-sheet-table')
        // else if (stateManager.getSelectedTab() == 'time-sheet-history')
        //     this.showElement('time-sheet-history')
        // else if (stateManager.getSelectedTab() == 'invoice-generation')
        //     this.showElement('invoice-generation')
        //
        // const menu = this.getElementsByClassName('side-menu')[0]
        // menu.addEventListener("timeSheetHistorySelected", () => this.showElement('time-sheet-history'))
        // menu.addEventListener('currentWeekSelected', () => this.showElement('time-sheet-table'))
        // menu.addEventListener('invoiceGeneratorSelected', () => this.showElement('invoice-generator'))
        // stateManager.logstate()
    }

    showElement(elementName) {
        const contentContainer = this.getElementsByClassName('content-container')[0]
        if (contentContainer.children.length > 0)
            contentContainer.removeChild(contentContainer.children[0])
        const element = document.createElement(elementName)
        contentContainer.appendChild(element)
        stateManager.setSelectedTab(elementName)
        stateManager.logstate()
    }
}

customElements.define('weekly-time-sheet', WeeklyTimeSheet)

function showElement(elementName) {
    const contentContainer = document.getElementsByClassName('content-container')[0]
    if (contentContainer.children.length > 0)
        contentContainer.removeChild(contentContainer.children[0])
    const element = document.createElement(elementName)
    contentContainer.appendChild(element)
}
const menu = document.getElementsByClassName('side-menu')[0]
menu.addEventListener("timeSheetHistorySelected", () => state.selectedTab = 'time-sheet-history')
menu.addEventListener('currentWeekSelected', () => state.selectedTab = 'time-sheet-table')
menu.addEventListener('invoiceGeneratorSelected', () => state.selectedTab = 'invoice-generator')

showElement(state.selectedTab)
//fsg



