export default class TimeSheetMenu extends HTMLElement {
    constructor() { super() }

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
                <button type='button' class='menu-item invoice-generator'>
                    <i class='fa-solid fa-dollar-sign fa-lg icon-style'></i>
                    Generate Invoice
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

        setupEventDispatch(this, 'current-week', 'currentWeekSelected')
        setupEventDispatch(this, 'time-sheet-history', "timeSheetHistorySelected")
        setupEventDispatch(this, 'invoice-generator', 'invoiceGeneratorSelected')

        function setupEventDispatch(t, button, event) {
            t.getElementsByClassName(button)[0].onclick =
                () => t.dispatchEvent(new Event(event))
        }
    }
}
