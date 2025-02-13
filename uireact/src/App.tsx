import { useState } from 'react'
import styles from './App.module.css'
import CurrentWeek from './currentWeek/CurrentWeekElement.tsx'
import { SideMenu } from './sideMenu/SideMenu.tsx'
import TimeSheetHistory from './history/TimeSheetHistoryElement.tsx'
import React from 'react';

enum tabs {
    currentWeek,
    timeSheetHistory,
    invoiceGenerator
}


export default function App() {
    const [selectedTab, setSelectedTab] = useState(tabs.timeSheetHistory)

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
    switch (selectedTab) {
        case tabs.currentWeek: return <CurrentWeek />
        case tabs.timeSheetHistory: return <TimeSheetHistory />
        default: break;
    }
}


