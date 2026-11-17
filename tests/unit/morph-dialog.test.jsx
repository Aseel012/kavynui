import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MorphDialog from '@/kavyn/morph-dialog'

function open() {
  render(<><MorphDialog /><button type="button">Outside</button></>)
  const trigger = screen.getByRole('button', { name: /Edge Functions/ })
  trigger.focus()
  fireEvent.click(trigger)
  return { trigger, dialog: screen.getByRole('dialog'), close: screen.getByRole('button', { name: 'Close' }) }
}

describe('MorphDialog keyboard focus', () => {
  it('moves focus inside and removes the hidden trigger from the tab order', () => {
    const { trigger, dialog, close } = open()
    expect(dialog.contains(document.activeElement)).toBe(true)
    expect(document.activeElement).toBe(close)
    expect(trigger.tabIndex).toBe(-1)
  })

  it('wraps Tab and Shift+Tab within the dialog', () => {
    const { close } = open()
    close.focus()
    expect(fireEvent.keyDown(close, { key: 'Tab', cancelable: true })).toBe(false)
    expect(document.activeElement).toBe(close)
    expect(fireEvent.keyDown(close, { key: 'Tab', shiftKey: true, cancelable: true })).toBe(false)
    expect(document.activeElement).toBe(close)
  })

  it('returns escaped focus to the dialog', () => {
    const { close } = open()
    screen.getByRole('button', { name: 'Outside' }).focus()
    expect(document.activeElement).toBe(close)
  })

  it('closes on Escape and restores the trigger', () => {
    const { trigger, close } = open()
    fireEvent.keyDown(close, { key: 'Escape' })
    expect(document.activeElement).toBe(trigger)
    expect(trigger.tabIndex).toBe(0)
  })

  it('restores focus after the close button and permits outside focus again', () => {
    const { trigger, close } = open()
    fireEvent.click(close)
    expect(document.activeElement).toBe(trigger)
    const outside = screen.getByRole('button', { name: 'Outside' })
    outside.focus()
    expect(document.activeElement).toBe(outside)
  })
})
