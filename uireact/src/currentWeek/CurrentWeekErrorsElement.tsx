import { DayError, DayErrors } from './models.ts'

interface CurrentWeekErrorsElementProps {
    errors: DayErrors;
}

export default function CurrentWeekErrorsElement(props: CurrentWeekErrorsElementProps) {
    return (
        <div className="errors">
            {getErrorMessages(props.errors).map((dayError, index) => (
                <label key={index}>{dayError}</label>
            ))}
        </div>
    )
}

function getErrorMessages(errors: DayErrors): string[] {
    return errors.errors.map(getErrorMessage)
}

function getErrorMessage(dayError: DayError) {
    const weekDay = dayError.workDay.getLongWeekDayName()
    return weekDay + ': ' + dayError.error
}


