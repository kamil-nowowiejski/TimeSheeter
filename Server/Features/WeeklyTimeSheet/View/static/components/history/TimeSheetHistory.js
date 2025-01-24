import { isTimeValueDefined, getTimeDifferenceInMinutes, timeInMinutesToString } from "../../helpers/timeHelpers.js";

export default class TimeSheetHistory extends HTMLElement {

    constructor() { super(); }

    async connectedCallback() {
        this.innerHTML = `
            <div>
                <div class='month-picker-container'>
                    <label for='month'>Month</label>
                    <input id='month' type="month" class='month-picker'>
                </div>

                <div class='weeks-container'>
                </div>

                <aggregated-stats class='aggregated-stats'></aggregated-stats>
            </div>

            <style>
                .weeks-container {
                    margin-top: 5px;
                    display: grid;
                    width: 60vw;
                }

                .month-picker-container {
                    margin-top: 20px;
                }

                .weekly-hours{
                    justify-self: left;
                    align-self: center;
                    margin-left: 10px;
                }

                .total-hours-header{
                    height: 30px;
                    margin-left: 10px;
                }

                .vertical-border{
                    width: 2px;
                    background-color: cornflowerBlue;
                    margin: 0px 10px 0px 10px;
                }
            </style>
        `

        this.getMonthPicker()
            .addEventListener('input', () => this.monthChangedCallback())

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
            .then(dto => this.transformDto(dto))
            .then(monthTime => {
                this.populateWeeks(monthTime.days)
                const aggregatedStats = this.getElementsByClassName('aggregated-stats')[0]
                aggregatedStats.monthTime = monthTime
            })
            .catch(error => console.error(error))
    }

    transformDto(dto) {
        return {
            earnings: dto.earnings,
            days: dto.days.map(d => ({
                date: new Date(Date.parse(d.date)),
                startTime: d.startTime,
                finishTime: d.finishTime
            }))
        }
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
        container.innerHTML = ``
        let row = 2
        weeks.forEach(week => {
            let column = 1
            const days = this.prepareWeekDays(week, weekTime)
            days.forEach(day => {
                const timeSheetDay = document.createElement('time-sheet-read-only-day')
                timeSheetDay.style = `grid-column: ${column};grid-row: ${row}`
                timeSheetDay.day = day
                container.appendChild(timeSheetDay)
                column++
            })

            this.spawnWeeklyTotalHours(days, column + 1, row, container);
            row++
        })

        this.spawnTotalHoursHeader(container, row);
    }

    spawnWeeklyTotalHours(days, column, row, container) {
        const weeklyHours = document.createElement('label');
        const totalWeekMinutes = days
            .filter(d => d?.startTime !== undefined && d?.finishTime !== undefined)
            .reduce((total, current) => total + getTimeDifferenceInMinutes(current.startTime, current.finishTime), 0);
        weeklyHours.textContent = timeInMinutesToString(totalWeekMinutes);
        weeklyHours.style = `grid-column: ${column};grid-row: ${row}`;
        weeklyHours.classList.add('weekly-hours');
        container.appendChild(weeklyHours);
    }

    spawnTotalHoursHeader(container, lastRow) {
        const verticalBorder = document.createElement('div')
        verticalBorder.style = `grid-column: 8;grid-row:1 / ${lastRow}`
        verticalBorder.classList.add('vertical-border')
        container.appendChild(verticalBorder)

        const totalHoursHeader = document.createElement('label');
        totalHoursHeader.textContent = 'Total';
        totalHoursHeader.classList.add('total-hours-header');
        totalHoursHeader.style = `grid-column: 9;grid-row: 1`;
        container.appendChild(totalHoursHeader);
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
            if (d === undefined)
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
