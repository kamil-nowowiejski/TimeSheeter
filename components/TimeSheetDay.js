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

    connectedCallback() {
        this.innerHTML = `
            <div class="column">
                <label>${this.label}</label>
                <input type="time" class="startTime">
                <input type="time" class="finishTime">
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
            </style>
        `;

        if (this.startTimeInputCallback !== undefined) {
            const startTimeElem = this.getElementsByClassName("startTime")[0];
            startTimeElem.addEventListener("input",
                async () => await this.startTimeInputCallback(startTimeElem.value));
        }

        if (this.finishTimeInputCallback !== undefined) {
            const finishTimeElem = this.getElementsByClassName("finishTime")[0];
            finishTimeElem.addEventListener("input",
                async () => await this.finishTimeInputCallback(finishTimeElem.value));
        }
    }
}

