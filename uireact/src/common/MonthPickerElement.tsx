import { useState,  } from 'react'
import { Month } from './models.ts';
import styles from './MonthPickerElement.module.css'

export interface MonthPickerProps {
    defaultValue: Month | undefined;
    onInput: (month: Month) => void;
    className?: string | undefined;
}

export default function MonthPicker(props: MonthPickerProps) {
    const [monthRawValue, setMonthRawValue] = useState<string>(getMonthString(props.defaultValue))
    const [yearRawValue, setYearRawValue] = useState<string>(getYearString(props.defaultValue))

    const onMonthChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        onMonthValueChanged(e.target.value, yearRawValue, setMonthRawValue, props.onInput)

    const onYearChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        onYearValueChanged(e.target.value, monthRawValue, setYearRawValue, props.onInput)


    return (
        <div className={props.className}>
            <label htmlFor='month'>Month</label>
            <div className={styles.masterContainer}>
                <input
                    type='text'
                    className={`${styles.inputElement} ${styles.month}`}
                    value={monthRawValue}
                    onChange={onMonthChange} />

                <label className={styles.separator}>-</label>

                <input
                    type='text'
                    className={`${styles.inputElement} ${styles.year}`}
                    value={yearRawValue}
                    onChange={onYearChange} />
            </div>
        </div>
    )
}

function onMonthValueChanged(
    updatedValue: string,
    currentYearRawValue: string,
    setMonthRawValue: (v: string) => void,
    setMonth: (m: Month) => void): void {

    if (updatedValue.length > 2 || containsOnlyNumbers(updatedValue) === false)
        return

    if (updatedValue === '')
        setMonthRawValue(updatedValue)

    if (isValidMonth(updatedValue)) {
        setMonthRawValue(updatedValue)
        const month = createMonth(updatedValue, currentYearRawValue)
        if (month !== undefined)
            setMonth(month)
    }
}

function onYearValueChanged(
    updatedValue: string,
    currentMonth: string,
    setYearRawValue: (v: string) => void,
    setMonth: (m: Month) => void): void {

    if (updatedValue.length > 4 || containsOnlyNumbers(updatedValue) === false)
        return

    if (updatedValue.length < 2)
        return

    setYearRawValue(updatedValue)

    if (updatedValue.length === 4) {
        const month = createMonth(currentMonth, updatedValue)
        if (month !== undefined)
            setMonth(month)
    }
}

function containsOnlyNumbers(value: string) {
    const regex = /[0-9]/
    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        if (regex.test(char) === false) {
            return false
        }
    }

    return true
}

function isValidMonth(value: string) {
    const month = Number.parseInt(value)
    return month >= 1 && month <= 12
}

function getMonthString(month: Month | undefined): string {
    return month === undefined ? '' : month.month.toString()
}
function getYearString(month: Month | undefined): string {
    return month === undefined ? '' : month.year.toString()
}
function createMonth(monthRawValue: string, yearRawValue: string): Month {
    const month = Number.parseInt(monthRawValue)
    const year = Number.parseInt(yearRawValue)
    return new Month(month, year)
}
