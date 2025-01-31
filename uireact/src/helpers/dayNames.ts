export function getShortDayName(dayIndex: number):string {
    switch (dayIndex) {
        case 1: return "Mon";
        case 2: return "Tu";
        case 3: return "Wen";
        case 4: return "Thu";
        case 5: return "Fri";
        case 6: return 'Sat';
        case 0: return 'Sun'
    }

    throw "Invalid day index"
}

export function getLongDayName(dayIndex: number): string {
    switch (dayIndex) {
        case 1: return "Monday"
        case 2: return "Tuesday"
        case 3: return "Wendsday"
        case 4: return "Thursday"
        case 5: return "Friday"
        case 6: return 'Saturday'
        case 0: return 'Sunday'
    }

    throw "Invalid day index";

}
