import { shallowMount } from '@vue/test-utils'
import TimeManager from '@/lib/TimeManager'

describe('TimeManager.js', () => {
    it('rounds to the nearest 5 minutes', () => {
        expect(TimeManager.round(135)).toBe(300)
        expect(TimeManager.round(535)).toBe(600)
        expect(TimeManager.round(4496)).toBe(4500)
    })
})
