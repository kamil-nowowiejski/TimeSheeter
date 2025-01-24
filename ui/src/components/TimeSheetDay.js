import { convertTimeToMinutes, timeInMinutesToString, isTimeValueUndefined, getTimeDifferenceInMinutes }  from '../helpers/timeHelpers.js'

export default class TimeSheetDay extends HTMLElement {

    constructor() { super(); }

    get startTime() { return this.getStartTimeValue() }
    set startTime(value) {
        this.getStartTimeElement().value = value;
        this.refreshWorkedHours()
    }

    get finishTime() { return this.getFinishTimeValue() }
    set finishTime(value) { 
        this.getFinishTimeElement().value = value
        this.refreshWorkedHours()
    }

    get workedTime() { return getTimeDifferenceInMinutes(this.startTime, this.finishTime) }

    get label() { return this._label; }
    set label(text) { this._label = text; }

    get timeInputCallback() { return this._timeInputCallback }
    set timeInputCallback(callback) { this._timeInputCallback = callback }

    get errorCallback() { return this._errorCallback }
    set errorCallback(callback) { this._errorCallback = callback }

    get errorClearedCallback() { return this._errorClearedCallback }
    set errorClearedCallback(callback) { this._errorClearedCallback = callback }

    get isLocked() { return this._isLocked }
    set isLocked(isLocked) { this._isLocked = isLocked }

    connectedCallback() {
        this.innerHTML = `
            <div class="column masterContainer ${this.isLocked ? 'locked' : ''}">
                <label class="dayLabel">${this.label}
                    <i class="padlockIcon fa-solid fa-lock" style="${this.isLocked ? '' : 'display: none'}"></i>
                </label>
                <input type="time" class="startTime" ${this.isLocked ? 'readonly' : ''}>
                <input type="time" class="finishTime" ${this.isLocked ? 'readonly' : ''}>
                <label class="workedHours">${this.getWorkedHours()}</label>
            </div>

            <style>
              .masterContainer {
                  margin-left: 20px;
              } 

              .masterContainer.locked {
                  background-color: lightGrey;
              }
              
              .masterContainer.valid {
                  background-color: transparent
              }

              .masterContainer.invalid {
                  background-color: lightCoral
              }
              .column {
                  display: flex;
                  flex-direction: column;
              }

              .padlockIcon {
                  cursor: pointer
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
            </style>
        `;

        this.getPadlockIconElement().onclick = () => this.unlockDay();
        this.getStartTimeElement().addEventListener("input", async () => await this.onTimeInput());
        this.getFinishTimeElement().addEventListener("input", async () => await this.onTimeInput());
    }

    unlockDay() {
        const masterContainer = this.getMasterContainer();
        if (masterContainer.classList.contains('locked')) {
            this.getStartTimeElement().removeAttribute('readonly');
            this.getFinishTimeElement().removeAttribute('readonly');
            this.getElementsByClassName('locked')[0].classList.remove('locked');
            const dayLabel = this.getElementsByClassName('dayLabel')[0]
            const padlockIcon = dayLabel.children[0]
            dayLabel.removeChild(padlockIcon)
        }
    }

    getWorkedHours() {
        const startTime = this.getStartTimeValue()
        const finishTime = this.getFinishTimeValue()

        if (isTimeValueUndefined(startTime) || isTimeValueUndefined(finishTime))
            return '-';

        const startTimeMinutes = convertTimeToMinutes(startTime);
        const finishTimeMinutes = convertTimeToMinutes(finishTime);

        if (finishTimeMinutes <= startTimeMinutes)
            return '-'

        const workTimeMinutes = finishTimeMinutes - startTimeMinutes;
        return timeInMinutesToString(workTimeMinutes);
    }

    async onTimeInput() {
        this.refreshWorkedHours()

        if (this.validateTimeInput() == false)
            return;

        const startTime = this.getStartTimeValue()
        const finishTime = this.getFinishTimeValue()
        await this.timeInputCallback?.(startTime, finishTime)
    }

    getStartTimeElement() { return this.getElementsByClassName("startTime")[0]; }
    getFinishTimeElement() { return this.getElementsByClassName("finishTime")[0]; }
    getStartTimeValue() { return this.getStartTimeElement()?.value; }
    getFinishTimeValue() { return this.getFinishTimeElement()?.value; }
    getMasterContainer() { return this.getElementsByClassName('masterContainer')[0] }
    getPadlockIconElement() { return this.getElementsByClassName('padlockIcon')[0] }
    unifyTimeValue(rawValue) { return isTimeValueUndefined(rawValue) ? undefined : rawValue }
    refreshWorkedHours() {
        const element = this.getElementsByClassName("workedHours")[0]
        element.textContent = this.getWorkedHours()
    }

    validateTimeInput() {
        const startTime = this.getStartTimeValue();
        const finishTime = this.getFinishTimeValue();
        if (isTimeValueUndefined(startTime) || isTimeValueUndefined(finishTime)) {
            this.resetValidationContainer();
            return true;
        }

        const startTimeMinutes = convertTimeToMinutes(startTime)
        const finishTimeMinutes = convertTimeToMinutes(finishTime)
        if (finishTimeMinutes <= startTimeMinutes) {
            this.setErrorInValidationContainer('Finish time must be greater than start time')
            return false;
        }

        this.resetValidationContainer();
        return true
    }

    resetValidationContainer() {
        const validationContainer = this.getElementsByClassName("masterContainer")[0];

        if (validationContainer.classList.contains('invalid'))
            validationContainer.classList.remove('invalid')

        if (validationContainer.classList.contains('valid') == false)
            validationContainer.classList.add('valid');

        this.errorClearedCallback?.()
    }

    setErrorInValidationContainer(error) {
        const validationContainer = this.getElementsByClassName("masterContainer")[0];

        if (validationContainer.classList.contains('valid'))
            validationContainer.classList.remove('valid');

        if (validationContainer.classList.contains('invalid') == false)
            validationContainer.classList.add('invalid')

        this.errorCallback?.(error)
    }
}

