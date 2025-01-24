//TODO get zus, vat etc. from config
export function getEarnings(days, earningsPerHour) {
    const vat = 0.23
    const zus = 2415.90
    const pit = 0.1086
    const hoursPerDay = 8

    const grossEarnings = days * hoursPerDay * earningsPerHour
    const netEarnings = (grossEarnings) * (1 - pit) - zus
    const grossVatEarnings = grossEarnings * (1 + vat)
    return [grossVatEarnings, grossEarnings, netEarnings]
}
