export default class TimeSheetDay extends HTMLElement {

    constructor() { super(); }

    get label() { return this._label; }
    set label(text) { this._label = text; }

    get timeInputCallback() { return this._timeInputCallback }
    set timeInputCallback(callback) { this._timeInputCallback = callback }

    get isLocked() { return this._isLocked }
    set isLocked(isLocked) { this._isLocked = isLocked }

    connectedCallback() {
        this.innerHTML = `
            <div class="masterContainer column ${this.isLocked ? 'locked' : ''}">
                <label>${this.label}</label>
                <div class="column timeValidationContainer valid">
                    <input type="time" class="startTime" ${this.isLocked ? 'readonly' : ''}>
                    <input type="time" class="finishTime" ${this.isLocked ? 'readonly' : ''}>
                </div>
                <label class="workedHours">${this.getWorkedHours()}</label>
                <input type="button" value="Unlock" class="unlockButton" ${this.isLocked ? '' : 'hidden'}/>
            </div>

            <style>
              .masterContainer {
                  margin-left: 20px;
              }
              
              .column {
                  display: flex;
                  flex-direction: column;
              }
              
              input {
                  width: 100px;
                  height: 50px;
                  margin-bottom: 10px;
              }
              
              label {
                  width: 100px;
                  height: 50px;
                  text-align: center;
                  line-height: 50px;
              }

              .locked {
                  background-color: lightGrey
              }

              .timeValidationContainer.valid {
                  background-color: transparent
              }

              .timeValidationContainer.invalid {
                  background-color: red
              }
            </style>
        `;

        this.getUnlockButtonElement().onclick = () => this.unlockDay();
        this.getStartTimeElement().addEventListener("input", async () => await this.onTimeInput());
        this.getFinishTimeElement().addEventListener("input", async () => await this.onTimeInput());
    }

    unlockDay() {
        this.getStartTimeElement().removeAttribute('readonly');
        this.getFinishTimeElement().removeAttribute('readonly');
        this.getElementsByClassName('locked')[0].classList.remove('locked');
        this.getUnlockButtonElement().setAttribute('hidden', true);
    }

    getWorkedHours() {
        const startTime = this.getStartTimeValue()
        const finishTime = this.getFinishTimeValue()

        if (this.isTimeValueUndefined(startTime) || this.isTimeValueUndefined(finishTime))
            return '-';

        const startTimeMinutes = this.convertTimeToMinutes(startTime);
        const finishTimeMinutes = this.convertTimeToMinutes(finishTime);

        if (finishTimeMinutes <= startTimeMinutes)
            return '-'

        const workTimeMinutes = finishTimeMinutes - startTimeMinutes;
        const workHours = Math.floor(workTimeMinutes / 60)
        const workMinutes = workTimeMinutes - workHours * 60
        return workHours + ":" + workMinutes;
    }

    async onTimeInput() {

        if (this.validateTimeInput() == false)
            return;

        this.refreshWorkedHours()

        const startTime = this.getStartTimeValue()
        const finishTime = this.getFinishTimeValue()
        await this.finishTimeInputCallback?.(startTime, finishTime)

    }

    getStartTimeElement() { return this.getElementsByClassName("startTime")[0]; }
    getFinishTimeElement() { return this.getElementsByClassName("finishTime")[0]; }
    getStartTimeValue() { return this.getStartTimeElement()?.value; }
    getFinishTimeValue() { return this.getFinishTimeElement()?.value; }
    unifyTimeValue(rawValue) { return this.isTimeValueUndefined(rawValue) ? undefined : rawValue }
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

    validateTimeInput() {
        const startTime = this.getStartTimeValue();
        const finishTime = this.getFinishTimeValue();
        if (this.isTimeValueUndefined(startTime) || this.isTimeValueUndefined(finishTime)) {
            this.resetValidationContainer();
            return true;
        }

        const startTimeMinutes = this.convertTimeToMinutes(startTime)
        const finishTimeMinutes = this.convertTimeToMinutes(finishTime)
        if (finishTimeMinutes <= startTimeMinutes) {
            this.setErrorInValidationContainer('Finish time must be greater than start time')
            return false;
        }
    }

    resetValidationContainer() {
        const validationContainer = this.getElementsByClassName("timeValidationContainer")[0];

        if (validationContainer.classList.contains('invalid'))
            validationContainer.classList.remove('invalid')

        if (validationContainer.classList.contains('valid') == false)
            validationContainer.classList.add('valid');
    }

    setErrorInValidationContainer(error) {
        const validationContainer = this.getElementsByClassName("timeValidationContainer")[0];

        if (validationContainer.classList.contains('valid'))
            validationContainer.classList.remove('valid');

        if(validationContainer.classList.contains('invalid') == false)
            validationContainer.classList.add('invalid')

    }

    isTimeValueUndefined(timeValue) { return timeValue === undefined || timeValue == '' }
}

