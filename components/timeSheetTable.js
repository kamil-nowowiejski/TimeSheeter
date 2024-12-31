export default class TimeSheetTable extends HTMLElement {

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
            <div class="flex-row" id="timeSheetContainer">
                <div class="startFinishLabels">
                    <label class="timeLabel">Start Time</label>
                    <label class="timeLabel">Finish Time</label>
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
                }
            </style>
        `;
        const container = shadow.getElementById("timeSheetContainer");
        for (let i = 1; i < 6; i++) {
            const timeSheetDay = document.createElement('time-sheet-day');
            timeSheetDay.label = this.getWeekDay(i);
            container.appendChild(timeSheetDay);
        }

    }

    getWeekDay(dayIndex) {
        const dateForDayIndex = this.getDateForDayOfWeek(dayIndex);
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

    getDateForDayOfWeek(dayIndex) {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const dayDifference = dayIndex - currentDay;
        const timeDifference = dayDifference * 1000 * 60 * 60 * 24;
        return new Date(currentDate.getTime() + timeDifference);
    }
}


