import './SideMenu.css'

export interface SideMenuProps {
    selectCurrentWeek: () => void;
    selectTimeSheetHistory: () => void;
    selectInvoiceGenerator: () => void;
}

export function SideMenu(props: SideMenuProps) {
    return (
        <div className="side-menu">
            <button type="button" className="menu-item current-week" onClick={props.selectCurrentWeek}>
                <i className="fa-solid fa-calendar-week fa-lg icon-style"></i>
                Current Week
            </button>

            <button type="button" className="menu-item time-sheet-history" onClick={props.selectTimeSheetHistory}>
                <i className="fa-solid fa-clock-rotate-left fa-lg icon-style"></i>
                Timesheet History
            </button>
            <button type='button' className='menu-item invoice-generator' onClick={props.selectInvoiceGenerator}>
                <i className='fa-solid fa-dollar-sign fa-lg icon-style'></i>
                Generate Invoice
            </button>
        </div>
    );
}
