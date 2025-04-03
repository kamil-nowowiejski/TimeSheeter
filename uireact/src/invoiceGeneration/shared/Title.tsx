import styles from './Title.module.scss'

interface TitleProps {
    title: string
}

export default function Title(props: TitleProps) {
    return (
        <label className={styles.title}>
            {props.title}
        </label>
    )
}
