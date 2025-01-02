import { convertTimeToMinutes, timeInMinutesToString } from '../helpers/timeHelpers.js'

export default class TimeSheetTable extends HTMLElement {

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
        this._timeSheetDays = []
    }
    connectedCallback() {
        this._shadow.innerHTML = `
            <div>
                <div class="flex-row" id="timeSheetContainer">
                    <div class="startFinishLabels">
                        <label class="timeLabel">Start Time</label>
                        <label class="timeLabel">Finish Time</label>
                        <label class="hoursWorked">Hours Worked</label>
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
                }

                .dayError {
                    color: red
                }
            </style>
        `;
        const container = this._shadow.getElementById("timeSheetContainer");
        const currentDate = new Date();

        for (let i = 1; i < 6; i++) {
            const timeSheetDay = document.createElement('time-sheet-day');
            timeSheetDay.label = this.getDayLabelText(i, currentDate);
            timeSheetDay.timeInputCallback = (startTime, finishTime) => this.onDayTimeInput(i, startTime, finishTime);
            timeSheetDay.errorCallback = (error) => this.showErrorForDay(i, error)
            timeSheetDay.errorClearedCallback = () => this.removeErrorForDay(i);
            timeSheetDay.isLocked = this.isPastDay(i, currentDate)
            container.appendChild(timeSheetDay);
            this._timeSheetDays.push(timeSheetDay)
        }

        this.updateRemainingTime()
    }

    getDayLabelText(dayIndex, currentDate) {
        const dateForDayIndex = this.getDateForDayOfWeek(dayIndex, currentDate);
        const dayOfWeekLabel = this.getShortDayName(dayIndex);
        return dayOfWeekLabel + " " + dateForDayIndex.getDate();
    }

    getShortDayName(dayIndex) {
        switch (dayIndex) {
            case 1: return "Mon";
            case 2: return "Tu";
            case 3: return "Wen";
            case 4: return "Thu";
            case 5: return "Fri";
        }
    }

    getLongDayName(dayIndex) {
        switch (dayIndex) {
            case 1: return "Monday"
            case 2: return "Tuesday"
            case 3: return "Wendsday"
            case 4: return "Thursday"
            case 5: return "Friday"
        }
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
        const dayName = this.getLongDayName(dayIndex);
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

    async saveTime(day, startTime, finishTime) { }

    updateRemainingTime() {
        const allWorkedTime = this._timeSheetDays
            .map(day => day.workedTime)
            .reduce((allTime, dayTime) => allTime + dayTime, 0)
        const fullWeekWorkTime = 40 * 60;
        const remainingTimeMinutes = fullWeekWorkTime - allWorkedTime;

        const remainingTimeLabel = this._shadow.querySelector('.remainingTime')
        remainingTimeLabel.textContent = "Remaining time: " + timeInMinutesToString(remainingTimeMinutes)
    }

    getErrorsElement() { return this._shadow.getElementById('errors') }

}


