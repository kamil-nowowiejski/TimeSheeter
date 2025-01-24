export default class InvoiceGenerator extends HTMLElement {
    constructor(){super()}

    async connectedCallback(){
        this.innerHTML = `
            <div>
                <month-picker></month-picker>
                <button type='button' class='generate-invoice-button'>
                    Generate invoice
                </button>
            </div>
        `

        this.getElementsByClassName('generate-invoice-button')[0]
            .onclick = () => this.generateInvoice()
    }

    generateInvoice(){
    }
}
