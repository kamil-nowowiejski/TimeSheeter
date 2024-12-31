export default class TimeSheetDay extends HTMLElement {

    constructor() {
        super();
        this._label = undefined;
    }

    get label() { return this._label; }
    set label(text) { this._label = text; }

    connectedCallback() {
        this.innerHTML = `
            <div class="column">
                <label>${this.label}</label>
                <input type="time">
                <input type="time">
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
    }
}

