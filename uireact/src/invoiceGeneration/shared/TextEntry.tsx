import styles from './Entry.module.scss'
import { KeyboardEvent } from 'react'
import LabelledEntry, { LabelDescriptor } from './LabelledEntry.tsx'

export interface TextEntryProps {
    defaultValue: string | string[]
    formItemName?: string
    isOptional?: boolean
    useMultiLine?: boolean
    onInput?: (value: string) => void
    label?: LabelDescriptor
}


export default function TextEntry(props: TextEntryProps) {
    const inputElement = props.useMultiLine ? createHtmlTextArea(props) : createHtmlInput(props)
    if(props.label === undefined)
        return inputElement

    return (<LabelledEntry label={props.label.text}>{inputElement}</LabelledEntry>)
}

function createHtmlInput(props: TextEntryProps) {
    return (
        <input
            className={styles.entryInput}
            required={props.isOptional === false}
            type="text"
            defaultValue={props.defaultValue}
            name={props.formItemName}
            onInput={e => props.onInput?.(e.currentTarget.value)}
        />
    )
}

function createHtmlTextArea(props: TextEntryProps) {
    const defaultValue = breakLines(props.defaultValue)

    return (
        <textarea
            className={styles.entryTextArea}
            required={props.isOptional === false}
            defaultValue={defaultValue}
            name={props.formItemName}
            rows={getNumerOfRows(defaultValue)}
            onKeyUp={autoResizeTextArea}
            onInput={(e) => props.onInput?.(e.currentTarget.value)}
        />
    )
}

function autoResizeTextArea(event: KeyboardEvent<HTMLTextAreaElement>): void {
    const textArea = event.target as HTMLTextAreaElement
    const rows = getNumerOfRows(textArea.value)
    textArea.rows = rows 
}

function getNumerOfRows(text: string) {
    const numberOfLines = text.split('\n')?.length ?? 1
    return numberOfLines <= 3 ? 3 : numberOfLines >= 6 ? 6 : numberOfLines
}

function breakLines(value: string | string[])  {
    if(typeof(value) === "string")
       return value; 

    return value.join("\n")
}
