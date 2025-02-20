import { WorkDay, WorkTimestamp } from "../common/models.ts";

export default class WorkDaysApi {

    public async getWorkDays(minDate: Date, maxDate: Date): Promise<WorkDay[]> {
        const dtos = await getWorkDaysDtos(minDate, maxDate)
        return convertToModel(dtos)
    }

    public async saveWorkDay(workDay: WorkDay) {

        const body = {
            date: serialize(workDay.date),
            startTime: workDay.startTime?.toString(),
            finishTime: workDay.finishTime?.toString()
        }

        const params = {
            headers: { "content-type": "application/json" },
            method: "POST",
            body: JSON.stringify(body)
        }

        await fetch('api/WorkDays/Save', params)
    }
}


interface WorkDayDto {
    date: string;
    startTime: string | undefined;
    finishTime: string | undefined;
}

async function getWorkDaysDtos(minDate: Date, maxDate: Date): Promise<WorkDayDto[]> {
    const queryParams = new URLSearchParams({
        minDate: serialize(minDate),
        maxDate: serialize(maxDate)
    })

    const url = 'api/WorkDays?' + queryParams

    return await fetch(url)
        .then(response => response.text())
        .then(json => JSON.parse(json))
}

function convertToModel(dtos: WorkDayDto[]): WorkDay[] {
    return dtos.map(dto => {
        const date = deserializeDate(dto.date)
        const startTime = WorkTimestamp.fromString(dto.startTime)
        const finishTime = WorkTimestamp.fromString(dto.finishTime)
        return new WorkDay(date, startTime, finishTime)
    })
}


function serialize(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function deserializeDate(stringDate: string): Date {
    const split = stringDate.split('-')
    const year = Number.parseInt(split[0])
    const month = Number.parseInt(split[1])
    const day = Number.parseInt(split[2])
    return new Date(year, month - 1, day)

}
