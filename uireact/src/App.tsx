import { useState } from 'react'
import './App.css'
import  CurrentWeek  from './currentWeek/CurrentWeek.tsx'
import { SideMenu } from './sideMenu/SideMenu.tsx'

enum tabs {
    currentWeek,
    timeSheetHistory,
    invoiceGenerator
}


export default function App() {
    const [selectedTab, setSelectedTab] = useState(tabs.currentWeek)

    return (
        <div className="flex-row">
            <SideMenu
                selectCurrentWeek={() => setSelectedTab(tabs.currentWeek)}
                selectTimeSheetHistory={() => setSelectedTab(tabs.timeSheetHistory)}
                selectInvoiceGenerator={() => setSelectedTab(tabs.invoiceGenerator)} />
            <div className="content-container">
                {getCurrentTab(selectedTab)}
            </div>
        </div>
    )
}

function getCurrentTab(selectedTab: tabs) {
    if (selectedTab === tabs.currentWeek)
        return <CurrentWeek />
}


