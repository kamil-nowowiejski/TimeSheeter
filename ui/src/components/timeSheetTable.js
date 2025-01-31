import { timeInMinutesToString } from '../helpers/timeHelpers.js'
import { getShortDayName, getLongDayName } from '../helpers/dayNames.js'

export default class TimeSheetTable extends HTMLElement {

    constructor() {
        super();
        this._timeSheetDays = []
    }
    async connectedCallback() {
        this.innerHTML = `
            <div>
                <div class="flex-row" id="timeSheetContainer">
                    <div class="startFinishLabels">
                        <label class="timeLabel">Start Time</label>
                        <label class="timeLabel">Finish Time</label>
                        <label class="hoursWorked timeLabel">Hours Worked</label>
                    </div>
                </div>
                <label class='remainingTime'></label>
                <div id="errors"></div>
            </div>
            
            <style>
                .flex-row {
                    display:flex;
                    flex-direction: row;
                }
            
                .startFinishLabels {
                    display: flex;
                    flex-direction: column;
                    margin-top: 50px;
                }

                .timeLabel {
                    width: 100px;
                    height: 50px;
                    text-align: left;
                    line-height: 50px;
                    margin-bottom: 10px;
                    text-wrap: nowrap;
                }

                .dayError {
                    color: red
                }
            </style>
        `;
        await fetch('weeklytimesheet/getcurrentweektime')
            .then(response => response.text())
            .then(json => JSON.parse(json))
            .then(weekTime => {
                const container = this.querySelector("#timeSheetContainer");
                const currentDate = new Date();

                for (let i = 1; i < 6; i++) {
                    const dayTimeDto = this.getWeekTimeDto(i, weekTime)
                    const timeSheetDay = document.createElement('time-sheet-day');
                    timeSheetDay.label = this.getDayLabelText(i, currentDate);
                    timeSheetDay.timeInputCallback = (startTime, finishTime) => this.onDayTimeInput(i, startTime, finishTime);
                    timeSheetDay.errorCallback = (error) => this.showErrorForDay(i, error)
                    timeSheetDay.errorClearedCallback = () => this.removeErrorForDay(i);
                    timeSheetDay.isLocked = this.isPastDay(i, currentDate)
                    container.appendChild(timeSheetDay);
                    this._timeSheetDays.push(timeSheetDay)
                    timeSheetDay.startTime = dayTimeDto.startTime;
                    timeSheetDay.finishTime = dayTimeDto.finishTime;
                }

                this.updateRemainingTime()
            })
            .catch(error => console.error(error))
    }

    getWeekTimeDto(dayIndex, weekTime) {
        switch (dayIndex) {
            case 1: return weekTime.monday;
            case 2: return weekTime.tuesday;
            case 3: return weekTime.wendsday;
            case 4: return weekTime.thrusday;
            case 5: return weekTime.friday;
        }
    }

    getDayLabelText(dayIndex, currentDate) {
        const dateForDayIndex = this.getDateForDayOfWeek(dayIndex, currentDate);
        const dayOfWeekLabel = getShortDayName(dayIndex);
        return dayOfWeekLabel + " " + dateForDayIndex.getDate();
    }

    getDateForDayOfWeek(dayIndex, currentDate) {
        const currentDay = currentDate.getDay();
        const dayDifference = dayIndex - currentDay;
        const timeDifference = dayDifference * 1000 * 60 * 60 * 24;
        return new Date(currentDate.getTime() + timeDifference);
    }

    isPastDay(dayIndex, currentDate) { return dayIndex < currentDate.getDay() }

    showErrorForDay(dayIndex, error) {
        this.removeErrorForDay(dayIndex);
        const dayName = getLongDayName(dayIndex);
        const errorsElement = this.getErrorsElement();
        const errorLabel = document.createElement("label");
        errorLabel.textContent = dayName + ": " + error;
        errorLabel.classList.add('dayError')
        errorLabel.id = 'dayError' + dayIndex
        errorsElement.append(errorLabel)
    }

    removeErrorForDay(dayIndex) {
        const errorsElement = this.getErrorsElement();
        const existingError = errorsElement.querySelector('#dayError' + dayIndex)
        if (existingError != null)
            errorsElement.removeChild(existingError);
    }

    async onDayTimeInput(dayIndex, startTime, finishTime) {
        this.updateRemainingTime();
        await this.saveTime(dayIndex, startTime, finishTime)
    }

    async saveTime(day, startTime, finishTime) {
        const body = {
            date: this.toUtcDate(day),
            startTime: startTime,
            finishTime: finishTime
        }

        const params = {
            headers: { "content-type": "application/json" },
            method: "POST",
            body: JSON.stringify(body)
        }

        await fetch('/weeklytimesheet/savetime', params)
            .catch(error => console.error(error))
    }

    toUtcDate(day) {
        const currentDay = new Date()
        const dateForDay = this.getDateForDayOfWeek(day, currentDay)
        return dateForDay.toISOString()
    }

   updateRemainingTime() {
        const allWorkedTime = this._timeSheetDays
            .map(day => day.workedTime)
            .reduce((allTime, dayTime) => allTime + dayTime, 0)
        const fullWeekWorkTime = 40 * 60;
        const remainingTimeMinutes = fullWeekWorkTime - allWorkedTime;

        const remainingTimeLabel = this.querySelector('.remainingTime')
        remainingTimeLabel.textContent = "Remaining time: " + timeInMinutesToString(remainingTimeMinutes)
    }

    getErrorsElement() { return this.querySelector('#errors') }

}


