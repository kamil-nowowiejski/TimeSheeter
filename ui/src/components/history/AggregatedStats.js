import { isTimeValueDefined } from "../../helpers/timeHelpers.js";
import { getEarnings } from "../../helpers/moneyCalculator.js";

export default class AggregatedStatsInfo extends HTMLElement {
    constructor() { super() }

    get monthTime() { return this._monthTime }
    set monthTime(value) {
        this._monthTime = value
        this.populateAggregatedStats()
    }


    connectedCallback() {
        this.innerHTML = `
            <div class='aggregated-stats'>
                <div>
                    <label class='worked-days'>Worked days: </label>
                    <button type='button' class='aggregated-stats-info'>
                        <i class='fa-solid fa-info fa-xs'></i>
                        </button>
                </div>
                <label class='earned-money-net'>Earned money (net): </label> 
                <label class='earned-money-gross'>Earned money (gross): </label>
                <label class='earned-money-gross-vat'>Earned money (gross + VAT): </label>
            </div>
            
            <aggregated-stats-info-modal class='aggregated-stats-info-modal'></aggregated-stats-info-modal>

            <style>
                .aggregated-stats {
                    display: flex;
                    flex-direction: column;
                    margin: 20px 0px 0px 10px;
                    font-size: 1.1em;
                }
                
                .aggregated-stats-info{
                    vertical-align: super;
                    border: none;
                    background-color: transparent;
                    padding: 0;
                    margin: 0;
                }

                .aggregated-stats-info:hover{
                    cursor: help;
                }

            </style>
        `
        this.getElementsByClassName('aggregated-stats-info')[0]
            .onclick = () => this.getElementsByClassName('aggregated-stats-info-modal')[0].open()
    }

    populateAggregatedStats() {
        const workedDaysElem = this.getElementsByClassName('worked-days')[0]
        const earnerdMoneyGrossVatElem = this.getElementsByClassName('earned-money-gross-vat')[0]
        const earnedMoneyGrossElem = this.getElementsByClassName('earned-money-gross')[0]
        const earnedMoneyNetElem = this.getElementsByClassName('earned-money-net')[0]

        const totalWorkedDays = this.monthTime.days
            .filter(d => isTimeValueDefined(d.startTime) && isTimeValueDefined(d.finishTime))
            .length

        const [grossVatEarnings, grossEarnings, netEarnings] =
            getEarnings(totalWorkedDays, this.monthTime.earnings.earningsPerHour)
        const currency = this.monthTime.earnings.currency

        workedDaysElem.textContent = `Worked days: ${totalWorkedDays}`
        earnerdMoneyGrossVatElem.textContent = `Earned money (gross + VAT): ${formatMoney(grossVatEarnings)}`
        earnedMoneyGrossElem.textContent = `Earned money (gross): ${formatMoney(grossEarnings)}`
        earnedMoneyNetElem.textContent = `Earned money (net): ${formatMoney(netEarnings)}`

        function formatMoney(value) {
            return Intl.NumberFormat('pl-pl', { style: 'currency', currency: currency })
                .format(value)
        }
    }
}
