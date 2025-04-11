import styles from './Section.module.scss'
import SectionTitle from './Title.tsx'
import { CSSProperties, JSXElement } from 'react'

export interface SectionProps {
    title: string
    style?: CSSProperties
    children: JSXElement[]
}

export default function Section(props: SectionProps) {
    adjustChildrenMargins(props.children)
    return (
        <div className={styles.masterContainer} style={props.style}>
            <SectionTitle title={props.title}/>
            <div className={styles.entriesContainer}>
                {props.children}
            </div>
        </div>
    )
}

function adjustChildrenMargins(children: JSXElement[]): void {
    children[0].style.marginTop = 0
    children[children.length - 1].style.marginBottom = 0
}
