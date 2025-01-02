export function convertTimeToMinutes(stringTime) {
    const split = stringTime.split(':');
    const hours = parseInt(split[0])
    const minutes = parseInt(split[1])
    return hours * 60 + minutes;

}

export function timeInMinutesToString(workTimeMinutes) {
    const workHours = Math.floor(workTimeMinutes / 60);
    const workMinutes = workTimeMinutes - workHours * 60;
    return workHours + ":" + workMinutes;
}

