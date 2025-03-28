import styles from './SectionTitleElement.module.scss'

interface SectionTitleElementProps {
    title: string
}

export default function SectionTitle(props: SectionTitleElementProps) {
    return (
        <label className={styles.title}>
            {props.title}
        </label>
    )
}
