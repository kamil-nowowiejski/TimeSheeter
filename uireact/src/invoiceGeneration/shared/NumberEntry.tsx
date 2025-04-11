import styles from './Entry.module.scss'
import LabelledEntry, { LabelDescriptor } from './LabelledEntry.tsx'

export interface NumberEntryProps {
    defaultValue: number 
    formItemName?: string
    isOptional?: boolean
    onInput?: (value: number) => void
    label?: LabelDescriptor
}

export default function NumberEntry(props: NumberEntryProps) {
    const inputElement = createInputElement(props)
    if(props.label === undefined)
        return inputElement;

    return (<LabelledEntry label={props.label.text}>{inputElement}</LabelledEntry>)
}

function createInputElement(props: NumberEntryProps) {
    return <input 
        className={styles.entryInput}
        required={props.isOptional === false}
        type="text"
        inputMode="decimal"
        defaultValue={props.defaultValue}
        name={props.formItemName}
        onInput={e => props.onInput?.(Number.parseFloat(e.currentTarget.value))} />
}

