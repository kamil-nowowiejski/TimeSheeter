export default class HumanizerApi {
    public async get(numberToHumanize: number) {
        const queryParams = new URLSearchParams({
            number: numberToHumanize.toString(),
        })

        const url = 'api/humanizer?' + queryParams

        return await fetch(url)
            .then((response) => response.text())
    }
}
