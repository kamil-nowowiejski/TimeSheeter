import { Earnings } from '../common/models.ts'

export default class EarningsApi {
    public async get() {
        const dto = await fetch('api/earnings')
            .then(response => response.text())
            .then(json => JSON.parse(json))

        return new Earnings(dto.earningsPerHours, dto.currency)
    }
}
