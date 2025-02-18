interface AmountCalculationModePickerProps {
    mode?: AmountCalculationMode | undefined
    onInput: (mode: AmountCalculationMode) => void
}

export enum AmountCalculationMode {
    fixedAmount = 1,
    actualHours = 2,
    overridenHours = 3,
}

export default function AmountCalculationModePicker(props: AmountCalculationModePickerProps) {
    return (
        <div>
            <label>Mode</label>
            <select defaultValue={props.mode ?? AmountCalculationMode.fixedAmount}>
                <option value={AmountCalculationMode.fixedAmount}>Fixed amount</option>
                <option value={AmountCalculationMode.actualHours}>Actual hours</option>
                <option value={AmountCalculationMode.overridenHours}>Overridden hours</option>
            </select>
        </div>
    )
}
