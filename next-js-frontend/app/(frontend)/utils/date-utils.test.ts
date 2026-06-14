import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { convertUTCToLocalTime } from './date-utils'

// Simulate a non-Berlin environment (e.g. Vercel UTC server or user with wrong TZ).
// A Moosach swimming training at 19:30 CEST is stored as 17:30 UTC in Payload.
const MOOSACH_SWIMMING_UTC = '2026-06-14T17:30:00.000Z'

let originalTZ: string | undefined

beforeAll(() => {
  originalTZ = process.env.TZ
  process.env.TZ = 'UTC'
})

afterAll(() => {
  if (originalTZ === undefined) {
    delete process.env.TZ
  } else {
    process.env.TZ = originalTZ
  }
})

describe('convertUTCToLocalTime', () => {
  test('always formats in Europe/Berlin regardless of server/browser timezone', () => {
    const result = convertUTCToLocalTime(MOOSACH_SWIMMING_UTC)
    // In Europe/Berlin on 2026-06-14 (CEST = UTC+2), 17:30 UTC → 19:30 local
    expect(result).toContain('19:30')
    expect(result).not.toContain('17:30') // UTC (wrong — Vercel server timezone)
    expect(result).not.toContain('18:30') // CET UTC+1 (wrong — e.g. user with DST disabled)
  })
})
