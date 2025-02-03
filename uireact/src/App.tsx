import { useState } from 'react'
import styles from './App.module.css'
import CurrentWeek from './currentWeek/CurrentWeekElement.tsx'
import { SideMenu } from './sideMenu/SideMenu.tsx'

enum tabs {
    currentWeek,
    timeSheetHistory,
    invoiceGenerator
}


export default function App() {
    const [selectedTab, setSelectedTab] = useState(tabs.currentWeek)

    return (
        <div className={styles.flexRow}>
            <SideMenu
                selectCurrentWeek={() => setSelectedTab(tabs.currentWeek)}
                selectTimeSheetHistory={() => setSelectedTab(tabs.timeSheetHistory)}
                selectInvoiceGenerator={() => setSelectedTab(tabs.invoiceGenerator)} />
            <div className={styles.contentContainer}>
                {getCurrentTab(selectedTab)}
            </div>
        </div>
    )
}

function getCurrentTab(selectedTab: tabs) {
    if (selectedTab === tabs.currentWeek)
        return <CurrentWeek />
}


