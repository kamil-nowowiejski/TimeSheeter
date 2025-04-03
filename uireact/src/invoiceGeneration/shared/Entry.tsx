import styles from './Entry.module.scss'
import { KeyboardEvent } from 'react'

export interface EntryProps {
    label: string
    defaultValue: string | string[]
    formItemName: string
    isOptional?: boolean
    useMultiLine?: boolean
    marginTop?: number;
    marginBottom?: number;
}


export default function Entry(props: EntryProps) {
    return (
        <div className={styles.entryContainer} style={{marginTop: props.marginTop, marginBottom: props.marginBottom}}>
            <label className={styles.entryLabel}>
                {props.label}
            </label>
            {props.useMultiLine ? createHtmlTextArea(props) : createHtmlInput(props)}
        </div>
    )
}

function createHtmlInput(props: EntryProps) {
    return (
        <input
            className={styles.entryInput}
            required={props.isOptional === false}
            type='text'
            defaultValue={props.defaultValue}
            name={props.formItemName}
        />
    )
}

function createHtmlTextArea(props: EntryProps) {
    const defaultValue = breakLines(props.defaultValue)

    return (
        <textarea
            className={styles.entryTextArea}
            required={props.isOptional === false}
            defaultValue={defaultValue}
            name={props.formItemName}
            rows={getNumerOfRows(defaultValue)}
            onKeyUp={autoResizeTextArea}
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
