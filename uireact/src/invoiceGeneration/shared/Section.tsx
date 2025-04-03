import styles from './Section.module.scss'
import SectionTitle from './Title.tsx'
import InvoiceDetailEntry from './Entry.tsx'
import { CSSProperties } from 'react'

export interface SectionProps {
    title: string
    entries: Entry[]
    style?: CSSProperties
}

export interface Entry {
    label: string
    defaultValue: string | string[]
    formItemName: string
    isOptional?: boolean
    useMultiLine?: boolean
}


export default function Section(props: SectionProps) {
    return (
        <div className={styles.masterContainer} style={props.style}>
            <SectionTitle title={props.title}/>
            <div className={styles.entriesContainer}>
                {createEntriesElements(props.entries)}
            </div>
        </div>
    )
}

function createEntriesElements(entries: Entry[]) {
    return entries.map((e, index) => {
        const marginTop = index === 0 ? 0 : undefined
        const marginBottom = index === entries.length -1 ? 0 : undefined
        return (<InvoiceDetailEntry 
            key={e.label}
            label={e.label}
            defaultValue={e.defaultValue}
            formItemName={e.formItemName}
            isOptional={e.isOptional}
            useMultiLine={e.useMultiLine}
            marginTop={marginTop}
            marginBottom={marginBottom}/>)
    })
}


