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

export async function saveTime(workDay: WorkDay): Promise<void> {
    const body = {
        date: toUtcDate(workDay.dayIndex),
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

    function toUtcDate(dayIndex: number) {
        const currentDay = new Date()
        const dateForDay = getDateForDayOfWeek(dayIndex, currentDay)
        return dateForDay.toISOString()
    }

    function getDateForDayOfWeek(dayIndex:number, currentDate: Date) {
        const currentDay = currentDate.getDay();
        const dayDifference = dayIndex - currentDay;
        const timeDifference = dayDifference * 1000 * 60 * 60 * 24;
        return new Date(currentDate.getTime() + timeDifference);
    }
}

