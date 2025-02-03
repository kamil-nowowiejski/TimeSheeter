import { describe, expect, test } from '@jest/globals'
import { DayErrors, DayError, WorkDay } from '../../src/currentWeek/models.ts'

describe('Updating DayErrors', () => {

    test('Completely new error', () => {
        //Arrange
        const sut = createSut(0)
        const workDay = getWorkDay()
        const error = 'test error 1'
        const expected = new DayErrors([{ workDay: workDay, error: error }])

        //Act 
        const actual = sut.update(workDay, error)

        //Assert
        checkEquality(sut, actual, expected)
    })

    test('Updating already existing error', () => {
        //Arrange
        const sut = createSut(5)
        const workDay = sut.errors[2].workDay
        const newError = 'this is completely new error'
        const newErrors = [...sut.errors]
        newErrors[2] = {workDay: workDay, error:newError}
        const expected = new DayErrors(newErrors)

        //Act 
        const actual = sut.update(workDay, newError)

        //Assert
        checkEquality(sut, actual, expected)
    })

    test('Removing existing error',() =>{
        //Arrange
        const sut = createSut(5)
        const workDay = sut.errors[2].workDay
        const newErrors = [...sut.errors]
        newErrors.splice(2, 1)
        const expected = new DayErrors(newErrors)

        //Act 
        const actual = sut.update(workDay, undefined)

        //Assert
        checkEquality(sut, actual, expected)
    })

    test('Remove non-existing error',()=>{
        //Arrange
        const sut = createSut(0)
        const workDay = getWorkDay(1)
        const errorsBeforeUpdate = [...sut.errors]

        //Act 
        const actual = sut.update(workDay, undefined)

        //Assert
        expect(actual).toBe(sut)
        expect(actual.errors).toEqual(errorsBeforeUpdate)
    })
})


function getWorkDay(dayIndex?: number): WorkDay {
    const index = dayIndex ?? 1
    return new WorkDay(index, undefined, undefined)
}

function createSut(errorsCount: number) {

    const errors: DayError[] = []
    for (let i = 0; i < errorsCount; i++) {
        const workDay = getWorkDay(i+1)
        const error = 'test error ' + i
        errors.push({ workDay: workDay, error: error })
    }

    return new DayErrors(errors);
}

function checkEquality(sut: DayErrors, actual: DayErrors, expected: DayErrors) {
    expect(actual).not.toBe(sut)
    expect(actual.errors).toEqual(expected.errors)
}
