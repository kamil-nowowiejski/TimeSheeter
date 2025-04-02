import styles from './InvoiceDetailEntryElement.module.css'
import { KeyboardEvent } from 'react'

export interface InvoiceDetailEntryProps {
    label: string
    defaultValue: string | string[]
    formItemName: string
    isOptional?: boolean
    useMultiLine?: boolean
    labelWidth?: number;
    inputWidth?: number;
    marginTop?: number;
    marginBottom?: number;
}


export default function InvoiceDetailEntryElement(props: InvoiceDetailEntryProps) {
    const containerStyle = createContainerStyle(props)
    return (
        <div className={styles.entryContainer} style={containerStyle}>
            <label className={styles.entryLabel} style={{minWidth: props.labelWidth}}>
                {props.label}
            </label>
            {props.useMultiLine ? createHtmlTextArea(props) : createHtmlInput(props)}
        </div>
    )
}

function createHtmlInput(props: InvoiceDetailEntryProps) {
    return (
        <input
            className={styles.entryInput}
            required={props.isOptional === false}
            type='text'
            defaultValue={props.defaultValue}
            name={props.formItemName}
            style={{minWidth: props.inputWidth}}
        />
    )
}

function createHtmlTextArea(props: InvoiceDetailEntryProps) {
    const defaultValue = breakLines(props.defaultValue)

    return (
        <textarea
            className={`${styles.entryTextArea} ${styles.entryInput}`}
            required={props.isOptional === false}
            defaultValue={defaultValue}
            name={props.formItemName}
            rows={getNumerOfRows(defaultValue)}
            style={{minWidth: props.inputWidth}}
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

function createContainerStyle(props: InvoiceDetailEntryProps): any {
    const style = {} as any
    if(props.marginTop !== undefined)
        style.marginTop = props.marginTop

    if(props.marginBottom !== undefined)
        style.marginBottom = props.marginBottom

    return style
}
