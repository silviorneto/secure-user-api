import { describe, it, expect } from 'vitest'
import { RegisterSchema, LoginSchema } from '../src/schemas/auth.schema.js'
import { UpdateProfileSchema } from '../src/schemas/user.schema.js'

describe('RegisterSchema', () => {
  it('accepts valid input', () => {
    const result = RegisterSchema.safeParse({ name: 'Alice', email: 'alice@test.com', password: 'Alice123!' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = RegisterSchema.safeParse({ name: 'Alice', email: 'not-an-email', password: 'Alice123!' })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 8 chars', () => {
    const result = RegisterSchema.safeParse({ name: 'Alice', email: 'alice@test.com', password: 'short' })
    expect(result.success).toBe(false)
  })

  it('rejects script injection in name field', () => {
    const result = RegisterSchema.safeParse({ name: '<script>alert(1)</script>', email: 'alice@test.com', password: 'Alice123!' })
    expect(result.success).toBe(false)
  })
})

describe('UpdateProfileSchema', () => {
  it('accepts partial update (only name)', () => {
    const result = UpdateProfileSchema.safeParse({ name: 'New Name' })
    expect(result.success).toBe(true)
  })

  it('rejects if no fields provided', () => {
    const result = UpdateProfileSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
