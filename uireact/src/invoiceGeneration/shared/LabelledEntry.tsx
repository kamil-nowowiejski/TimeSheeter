import styles from './LabelledEntry.module.scss'
import { JSXElement } from 'react'

export interface LabelledEntryProps {
    label: string
    children: JSXElement | JSXElement[]
}

export interface LabelDescriptor {
    text: string
}

export default function LabelledEntry(props: LabelledEntryProps) {
    return (
        <div className={styles.entryContainer}>
            <label className={styles.entryLabel}>
                {props.label}
            </label>
            {props.children}
        </div>
    )
}
