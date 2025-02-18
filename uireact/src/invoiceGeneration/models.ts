export  interface Company{
    name: FormItem
    nip: FormItem
    street: FormItem
    postalCode: FormItem
    city: FormItem
}

export interface FormItem{
    defaultValue: string
    formItemName: string
}


export class InvoiceItem {
    private _description: string
    private _unit: string
    private _amount: number
    private _netPrice: number
    private _vatRate: number

    public get description() {
        return this._description
    }
    public get unit() {
        return this._unit
    }
    public get amount() {
        return this._amount
    }
    public get netPrice() {
        return this._netPrice
    }
    public get vatRate() {
        return this._vatRate
    }

    public get vatValue() {
        return this._netPrice * this._vatRate
    }

    public get grossValue() {
        return this._netPrice + this.vatValue
    }
    constructor(description: string, unit: string, amount: number, netPrice: number, vatRate: number) {
        this._description = description
        this._unit = unit
        this._amount = amount
        this._netPrice = netPrice
        this._vatRate = vatRate
    }
}
