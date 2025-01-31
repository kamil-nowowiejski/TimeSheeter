import { CurrentWeek, WorkDay, WorkTimestamp } from "../currentWeek/models";
export async function getCurrentWeekTime(): Promise<CurrentWeek> {
    const response = await fetch('weeklytimesheet/getcurrentweektime');
    const text = await response.text();
    const dto = JSON.parse(text);
    return new CurrentWeek(
        toModel(1, dto.monday),
        toModel(2, dto.tuesday),
        toModel(3, dto.wendsday),
        toModel(4, dto.thrusday),
        toModel(5, dto.friday))

    function toModel(dayIndex: number, dto: { startTime: string, finishTime: string }) {
        return new WorkDay(dayIndex, WorkTimestamp.fromString(dto.startTime), WorkTimestamp.fromString(dto.finishTime))
    }
}

export async function saveTime(): Promise<void> {
    throw 'not implemented'
}

