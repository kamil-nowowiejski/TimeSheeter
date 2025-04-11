import styles from './SideMenu.module.scss'

export interface SideMenuProps {
    selectCurrentWeek: () => void;
    selectTimeSheetHistory: () => void;
    selectInvoiceGenerator: () => void;
}

export function SideMenu(props: SideMenuProps) {
    return (
        <div className={styles.sideMenu}>
            <button type="button" className={styles.menuItem} onClick={props.selectCurrentWeek}>
                <i className={`fa-solid fa-calendar-week fa-lg ${styles.icon}`}></i>
                Current Week
            </button>

            <button type="button" className={styles.menuItem} onClick={props.selectTimeSheetHistory}>
                <i className={`fa-solid fa-clock-rotate-left fa-lg ${styles.icon}`}></i>
                Timesheet History
            </button>
            <button type='button' className={styles.menuItem} onClick={props.selectInvoiceGenerator}>
                <i className={`fa-solid fa-dollar-sign fa-lg ${styles.icon}`}></i>
                Generate Invoice
            </button>
        </div>
    );
}
