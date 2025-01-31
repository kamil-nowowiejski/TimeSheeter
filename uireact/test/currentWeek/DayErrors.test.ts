import { describe, expect, test } from '@jest/globals'
import { DayErrors, WorkDay } from '../../src/currentWeek/models.ts'

describe('Updating DayErrors', () => {

    test('Completely new error', () => {
        //Arrange
        const dayErrors = new DayErrors([]);
        const workDay = getWorkDay()
        const error = 'test error 1'

        //Act 
       const actual = dayErrors.update(workDay, error) 

        //Assert
        expect(actual).not.toEqual(dayErrors)

    })
})


function getWorkDay(dayIndex?: number): WorkDay{
    const index = dayIndex ?? 1
    return new WorkDay(index, undefined, undefined)
}
