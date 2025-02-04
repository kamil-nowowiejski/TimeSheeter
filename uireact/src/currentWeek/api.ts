import { CurrentWeek } from "../currentWeek/models";
import { WorkDay, WorkTimestamp } from '../common/models.ts'
export async function getCurrentWeekTime(): Promise<CurrentWeek> {
    const response = await fetch('weeklytimesheet/getcurrentweektime');
    const text = await response.text();
    const dto: CurrentWeekTimeDto = JSON.parse(text);
    return new CurrentWeek(
        toModel(dto.monday),
        toModel(dto.tuesday),
        toModel(dto.wendsday),
        toModel(dto.thrusday),
        toModel(dto.friday))

    function toModel(dto: WorkDayDto) {
        const date = new Date(Date.parse(dto.date))
        return new WorkDay(date, WorkTimestamp.fromString(dto.startTime), WorkTimestamp.fromString(dto.finishTime))
    }
}

export async function saveTime(workDay: WorkDay): Promise<void> {
    const body = {
        date: workDay.date.toISOString(),
        startTime: workDay.startTime?.toString(),
        finishTime: workDay.finishTime?.toString()
    }

    const params = {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(body)
    }

    await fetch('/weeklytimesheet/savetime', params)
        .catch(error => console.error(error))
}

interface CurrentWeekTimeDto {
    monday: WorkDayDto;
    tuesday: WorkDayDto;
    wendsday: WorkDayDto;
    thrusday: WorkDayDto;
    friday: WorkDayDto;
}

interface WorkDayDto {
    date: string;
    startTime: string | undefined;
    finishTime: string | undefined;
}

