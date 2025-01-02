export default class TimeSheetDay extends HTMLElement {

    constructor() { super(); }

    get label() { return this._label; }
    set label(text) { this._label = text; }

    get startTimeInputCallback() { return this._startTimeInputCallback }
    set startTimeInputCallback(callback) {
        this._startTimeInputCallback = callback
    }

    get finishTimeInputCallback() { return this._finishTimeInputCallback }
    set finishTimeInputCallback(callback) {
        this._finishTimeInputCallback = callback;
    }

    get isLocked() { return this._isLocked }
    set isLocked(isLocked) { this._isLocked = isLocked }

    unlockDay() {
        this.getStartTimeElement().removeAttribute('readonly');
        this.getFinishTimeElement().removeAttribute('readonly');
        this.getElementsByClassName('locked')[0].classList.remove('locked');
        this.getUnlockButtonElement().setAttribute('hidden', true);
    }

    getWorkedHours() {
        const startTime = this.getStartTimeValue()
        const finishTime = this.getFinishTimeValue()

        if (startTime === undefined || startTime == '' || finishTime === undefined || finishTime == '')
            return '-';

        const startTimeMinutes = this.convertTimeToMinutes(startTime);
        const finishTimeMinutes = this.convertTimeToMinutes(finishTime);
        const workTimeMinutes = finishTimeMinutes - startTimeMinutes;
        const workHours = Math.floor(workTimeMinutes / 60)
        const workMinutes = workTimeMinutes - workHours * 60
        return workHours + ":" + workMinutes;
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="column ${this.isLocked ? 'locked' : ''}">
                <label>${this.label}</label>
                <input type="time" class="startTime" ${this.isLocked ? 'readonly' : ''}>
                <input type="time" class="finishTime" ${this.isLocked ? 'readonly' : ''}>
                <label class="workedHours">${this.getWorkedHours()}</label>
                <input type="button" value="Unlock" class="unlockButton" ${this.isLocked ? '' : 'hidden'}/>
            </div>

            <style>
              .column {
                  display: flex;
                  flex-direction: column;
                  margin-left: 20px;
              }
              
              .column > input {
                  width: 100px;
                  height: 50px;
                  margin-bottom: 10px;
              }
              
              .column > label {
                  width: 100px;
                  height: 50px;
                  text-align: center;
                  line-height: 50px;
              }

              .locked {
                  background-color: lightGrey
              }
            </style>
        `;

        this.getUnlockButtonElement().onclick = () => this.unlockDay();
        this.getStartTimeElement().addEventListener("input", async () => await this.onStartTimeInput());
        this.getFinishTimeElement().addEventListener("input", async () => await this.onFinishTimeInput());
    }

    async onStartTimeInput() {
        this.refreshWorkedHours()
        await this.startTimeInputCallback?.(this.getStartTimeValue())
    }

    async onFinishTimeInput() {
        this.refreshWorkedHours()
        await this.finishTimeInputCallback?.(this.getFinishTimeValue())
    }

    getStartTimeElement() { return this.getElementsByClassName("startTime")[0]; }
    getFinishTimeElement() { return this.getElementsByClassName("finishTime")[0]; }
    getStartTimeValue() { return this.getStartTimeElement()?.value; }
    getFinishTimeValue() { return this.getFinishTimeElement()?.value; }
    getUnlockButtonElement() { return this.getElementsByClassName("unlockButton")[0] }
    refreshWorkedHours() {
        const element = this.getElementsByClassName("workedHours")[0]
        element.textContent = this.getWorkedHours()
    }

    convertTimeToMinutes(stringTime) {
        const split = stringTime.split(':');
        const hours = parseInt(split[0])
        const minutes = parseInt(split[1])
        return hours * 60 + minutes;
        
    }
}

