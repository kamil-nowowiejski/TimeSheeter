import { jsPDF } from 'jspdf'

export interface TextDimensions {
    firstLineHeight: number
    totalHeight: number
    totalWidth: number
}

export function getTextDimensions(doc: jsPDF, text: string[] | string): TextDimensions {
    const split = typeof text === 'string' ? (text as string).split('\n') : text as string[]
    //getTextDimensions accepts an array of strings which works better than passing a concatenated string
    const allTextDims = doc.getTextDimensions(split)
    const lastLineTextDim = doc.getTextDimensions(split[split.length - 1])
    const firtLineTextDim = doc.getTextDimensions(split[0])

    return {
        totalWidth: allTextDims.w,
        totalHeight: allTextDims.h + lastLineTextDim.h / 2,
        firstLineHeight: firtLineTextDim.h,
    }
}

