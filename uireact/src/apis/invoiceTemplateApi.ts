import { InvoiceTemplate } from '../common/models.ts'

export default class InvoiceTemplateApi {
    public async get(): Promise<InvoiceTemplate> {
        const dto = await fetch('api/invoiceTemplate')
            .then((response) => response.text())
            .then((json) => JSON.parse(json))

        return dto
    }
}
