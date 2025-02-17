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

