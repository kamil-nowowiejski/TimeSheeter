import { jsPDF } from 'jspdf'

export interface TextSize {
    height: number
    width: number
}

export function getTextSize(doc: jsPDF, text: string[] | string): TextSize {
    const split = typeof text === 'string' ? (text as string).split('\n') : text as string[]
    //getTextDimensions accepts an array of strings which works better than passing a concatenated string
    const allTextDims = doc.getTextDimensions(split)
    const lastLineTextDim = doc.getTextDimensions(split[split.length - 1])

    return {
        width: allTextDims.w,
        height: allTextDims.h + lastLineTextDim.h / 2,
    }
}

export function toMoneyFormat(n: number, currency?: string) {
    const formatted = new Intl
        .NumberFormat('pl-PL', { minimumFractionDigits: 2, useGrouping: true })
        .format(n)
    return currency !== undefined ? `${formatted} ${currency}` : formatted
}

export function toPercentage(n: number) {
    return new Intl
        .NumberFormat('pl-PL', { maximumFractionDigits: 0, useGrouping: true, style: 'percent' })
        .format(n)
}
