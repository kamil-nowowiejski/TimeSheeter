export default class TimeSheetHistory extends HTMLElement {
    constructor() { super() }

    async connectedCallback() {
        this.innerHTML = `
            <div>
                <div class='month-picker-container'>
                    <label for='month'>Month</label>
                    <input id='month' type="month" class='month-picker'>
                </div>
                <div class='weeks-container'>
                </div>
            </div>

            <style>
                .weeks-container{
                    margin-top: 15px;
                }

                .month-picker-container{
                    margin-top: 20px;
                }
            </style>
        `

        const monthPicker = this.getMonthPicker()
        monthPicker.addEventListener('input', () => this.monthChangedCallback())
        await this.setCurrentMonth()
    }

    async monthChangedCallback() {
        const [firstDayOfMonth, lastDayOfMonth] = this.getMonthEdgeDays()
        if (firstDayOfMonth === undefined || lastDayOfMonth === undefined)
            return

        await fetch('/timesheethistory?' + new URLSearchParams({
            minDate: this.toDateString(firstDayOfMonth),
            maxDate: this.toDateString(lastDayOfMonth)
        }))
            .then(response => response.text())
            .then(json => JSON.parse(json))
            .then(dto => dto.days.map(d => {
                return {
                    date: new Date(Date.parse(d.date)),
                    startTime: d.startTime,
                    finishTime: d.finishTime
                }
            }))
            .then(monthTime => { this.populateWeeks(monthTime) })
            .catch(error => console.error(error))
    }

    getMonthEdgeDays() {
        const selectedMonth = this.getMonthPicker().value
        const firstDay = new Date(Date.parse(selectedMonth + '-01'))

        if (firstDay.getFullYear() < 2000)
            return [undefined, undefined]

        const lastDay = new Date(firstDay.getUTCFullYear(), firstDay.getMonth() + 1, 0)
        return [firstDay, lastDay]
    }

    toDateString(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }

    getMonthPicker() { return this.getElementsByClassName('month-picker')[0] }

    async setCurrentMonth() {
        const monthPicker = this.getMonthPicker()
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
        const value = currentYear + '-' + currentMonth
        monthPicker.value = value
        await this.monthChangedCallback()
    }

    populateWeeks(weekTime) {
        const allDays = this.getAllDaysInSelectedMonth()
        const weeks = this.splitDaysIntoWeeks(allDays)
        const container = this.getElementsByClassName('weeks-container')[0]
        weeks.forEach(week => {
            const weekElement = document.createElement('time-sheet-read-only-week')
            const days = this.prepareWeekDays(week, weekTime)
            weekElement.days = days
            container.appendChild(weekElement)
        })

    }

    getAllDaysInSelectedMonth() {
        const [firstDay, lastDay] = this.getMonthEdgeDays()
        const allDays = [firstDay]
        for (let i = 2; i < lastDay.getDate(); i++) {
            const stringDay = firstDay.getFullYear() + '-' + (firstDay.getMonth() + 1) + '-' + i
            const day = new Date(stringDay)
            allDays.push(day)
        }
        allDays.push(lastDay)
        return allDays
    }

    splitDaysIntoWeeks(allDays) {
        const weeks = []
        const days = allDays.slice()

        while (days.length > 0) {
            const currentWeek = [days.shift()]
            const beginWeekDay = currentWeek[0].getDay()
            const daysToTake = beginWeekDay === 0 ? 0 : 7 - beginWeekDay
            for (let i = 0; i < daysToTake; i++) {
                currentWeek.push(days.shift())
            }

            const emptyDaysToFill = beginWeekDay === 0 ? 6 : beginWeekDay - 1
            for (let i = 0; i < emptyDaysToFill; i++) {
                currentWeek.unshift(undefined)
            }

            weeks.push(currentWeek)
        }

        return weeks
    }

    prepareWeekDays(week, weekTime) {
        return week.map(d => {
            if(d === undefined)
                return undefined

            const dayTime = weekTime.find(dt => dt.date.getDate() === d.getDate())
            return {
                date: d,
                startTime: dayTime?.startTime,
                finishTime: dayTime?.finishTime
            }
        })
    }
}
