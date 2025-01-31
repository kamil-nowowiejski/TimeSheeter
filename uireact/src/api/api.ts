export async function getCurrentWeekTime(): Promise<CurrentWeekTime> {
    const response = await fetch('weeklytimesheet/getcurrentweektime');
    const text = await response.text();
    const dto = JSON.parse(text);
    return new CurrentWeekTimeImp(dto.monday, dto.tuesday, dto.wendsday, dto.thrusday, dto.friday)
}

export async function saveTime(): Promise<void>{
    throw 'not implemented'
}

export interface CurrentWeekTime {
    monday: DayTime;
    tuesday: DayTime;
    wendsday: DayTime;
    thrusday: DayTime;
    friday: DayTime;

    toArray(): DayTime[];
    getDay(dayIndex: number): DayTime
    updateTime(dayIndex: number, startTime: string | null, finishTime: string | null): CurrentWeekTime;
}

export interface DayTime {
    date: string;
    startTime: string | null;
    finishTime: string | null;
}


class CurrentWeekTimeImp implements CurrentWeekTime {
    constructor(monday: DayTime, tuesday: DayTime, wendsday: DayTime, thrusday: DayTime, friday: DayTime) {
        this.monday = monday;
        this.tuesday = tuesday;
        this.wendsday = wendsday;
        this.thrusday = thrusday;
        this.friday = friday
    }
    monday: DayTime;
    tuesday: DayTime;
    wendsday: DayTime;
    thrusday: DayTime;
    friday: DayTime;

    toArray(): DayTime[] {
        return [this.monday, this.tuesday, this.wendsday, this.thrusday, this.friday]
    }

    getDay(dayIndex: number): DayTime {
        switch (dayIndex) {
            case 1: return this.monday;
            case 2: return this.tuesday;
            case 3: return this.wendsday;
            case 4: return this.thrusday;
            case 5: return this.friday;
        }

        throw "Invalid day index"
    }

    updateTime(
        dayIndex: number,
        startTime: string | null, 
        finishTime: string | null): CurrentWeekTime {
        const day = this.getDay(dayIndex)
        day.startTime = startTime;
        day.finishTime = finishTime
        return new CurrentWeekTimeImp(this.monday, this.tuesday, this.wendsday, this.thrusday, this.friday)
    }

}
