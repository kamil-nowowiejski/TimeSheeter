export function convertTimeToMinutes(stringTime: string): number {
    const split = stringTime.split(':');
    const hours = parseInt(split[0])
    const minutes = parseInt(split[1])
    return hours * 60 + minutes;

}

export function timeInMinutesToString(workTimeMinutes: number): string {
    const workHours = Math.floor(workTimeMinutes / 60);
    const workMinutes = workTimeMinutes - workHours * 60;
    const hoursString = String(workHours).padStart(2, '0')
    const minutesString = String(workMinutes).padStart(2, '0')
    return hoursString + ":" + minutesString;
}

export function getTimeDifferenceInMinutes(startTime:string|undefined|null, finishTime:string|undefined|null) {
    if (isTimeValueUndefined(startTime) || isTimeValueUndefined(finishTime))
        return 0;
    return convertTimeToMinutes(finishTime) - convertTimeToMinutes(startTime)
}

export function isTimeValueUndefined(timeValue: string |undefined|null) { return timeValue === undefined || timeValue == '' || timeValue === null }
export function isTimeValueDefined(timeValue: string |undefined|null) { return isTimeValueUndefined(timeValue) === false }
