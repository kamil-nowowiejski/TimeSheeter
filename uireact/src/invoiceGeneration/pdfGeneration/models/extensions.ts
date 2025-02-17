import {Color, Drawing, Font }from './templateDefintion.ts'
import jsPDF from 'jspdf';

export function setDrawing(doc: jsPDF, drawing: Drawing){
    setFillColor(doc, drawing.fillColor)
    setDrawColor(doc, drawing.lineColor)
    doc.setLineWidth(drawing.lineWidth)
    
}

function setFillColor(doc: jsPDF, color: Color){
    doc.setFillColor(color.r, color.g, color.b)
}

function setDrawColor(doc: jsPDF, color: Color){
    doc.setDrawColor(color.r, color.g, color.b)
}

export function setFont(doc: jsPDF, font: Font){
    doc.setFont(font.name, font.style)
    doc.setFontSize(font.size)
}

