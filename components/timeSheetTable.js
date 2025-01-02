export default class TimeSheetTable extends HTMLElement {

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
            <div class="flex-row" id="timeSheetContainer">
                <div class="startFinishLabels">
                    <label class="timeLabel">Start Time</label>
                    <label class="timeLabel">Finish Time</label>
                    <label class="hoursWorked">Hours Worked</label>
                </div>
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
            </style>
        `;
        const container = shadow.getElementById("timeSheetContainer");
        const currentDate = new Date();

        for (let i = 1; i < 6; i++) {
            const timeSheetDay = document.createElement('time-sheet-day');
            timeSheetDay.label = this.getDayLabelText(i, currentDate);
            timeSheetDay.startTimeInputCallback = (time) => this.saveStartTime(i, time);
            timeSheetDay.finishTimeInputCallback = (time) => this.saveFinishTime(i, time);
            timeSheetDay.isLocked = this.isPastDay(i, currentDate)
            container.appendChild(timeSheetDay);
        }

    }

    getDayLabelText(dayIndex, currentDate) {
        const dateForDayIndex = this.getDateForDayOfWeek(dayIndex, currentDate);
        const dayOfWeekLabel = this.getDayOfWeekLabel(dayIndex);
        return dayOfWeekLabel + " " + dateForDayIndex.getDate();
    }

    getDayOfWeekLabel(dayIndex) {
        switch (dayIndex) {
            case 1: return "Mon";
            case 2: return "Tu";
            case 3: return "Wen";
            case 4: return "Thu";
            case 5: return "Fri";
        }
    }

    getDateForDayOfWeek(dayIndex, currentDate) {
        const currentDay = currentDate.getDay();
        const dayDifference = dayIndex - currentDay;
        const timeDifference = dayDifference * 1000 * 60 * 60 * 24;
        return new Date(currentDate.getTime() + timeDifference);
    }

    isPastDay(dayIndex, currentDate) { return dayIndex < currentDate.getDay() }

    saveStartTime(day, time) { }
    saveFinishTime(day, time) { }

}


