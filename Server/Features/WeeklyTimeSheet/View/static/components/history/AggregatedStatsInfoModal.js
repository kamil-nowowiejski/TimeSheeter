export default class AggregatedStatsInfoModal extends HTMLElement {
    constructor() { super() }

    connectedCallback() {
        this.innerHTML = `
            <div class='modal'>
                <div class='modal-content'>
                    <label>
                        Earned money is calculated based on the worked days value, not the actual worked hours.<br>
                        It is assumed that each worked day consists of 8 hours. 
                    </label>
                    <button class='close-button'>
                        <i class='fa-solid fa-xmark'></i>
                        Close
                    </button>
                </div>
            </div>

            <style>
                .modal{
                    display: none;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7);
                    border: solid;
                    border-width: 2px;
                }

                .modal-content{
                    background-color: mintCream;
                    width: 50%; 
                    margin: 15% auto;
                    border: solid 1px;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;

                }

                .close-button{
                    background-color: transparent;
                    border: solid;
                    border-width: 2px;
                    width: 90px;
                    height: 40px;
                    margin-left: auto;
                    margin-right: 0;
                    margin-top: 20px;
                    font-size: medium;
                }

                .close-button:hover{
                    cursor: pointer;
                }
            </style>
        `

        this.getElementsByClassName('close-button')[0]
            .onclick = () => this.close()
    }

    open() {
        this.getAggregatedStatsInfoModal().style.display = 'block';
    }

    close() {
        this.getAggregatedStatsInfoModal().style.display = 'none';
    }

    getAggregatedStatsInfoModal() { return this.getElementsByClassName('modal')[0] }

}
