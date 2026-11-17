import { StrictMode } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

describe('MorphDialog ownership', () => {
  it('only traps focus and handles Escape in the most recently opened dialog', () => {
    render(<><MorphDialog title="First" /><MorphDialog title="Second" /></>)
    fireEvent.click(screen.getByRole('button', { name: /First/ }))
    fireEvent.click(screen.getByRole('button', { name: /Second/ }))
    const [first, second] = screen.getAllByRole('dialog')
    expect(second.contains(document.activeElement)).toBe(true)
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(first.contains(document.activeElement)).toBe(true)
  })

  it('makes background branches inert and restores their prior state', () => {
    const { trigger, close, dialog } = open()
    const outside = screen.getByRole('button', { name: 'Outside' })
    expect(outside.inert).toBe(true)
    expect(dialog.previousElementSibling.inert).not.toBe(true)
    fireEvent.click(close)
    expect(outside.inert).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(dialog.getAttribute('aria-modal')).toBeNull()
    expect(dialog.getAttribute('aria-hidden')).toBe('true')
    expect(dialog.hasAttribute('inert')).toBe(true)
  })

  it('cleans up modality on unmount and through StrictMode replay', () => {
    const { unmount } = render(<StrictMode><MorphDialog /></StrictMode>)
    fireEvent.click(screen.getByRole('button', { name: /Edge Functions/ }))
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)
    unmount()
    const button = document.createElement('button')
    document.body.appendChild(button)
    button.focus()
    expect(document.activeElement).toBe(button)
    button.remove()
  })


  it('keeps background restrictions applied by the application while open', () => {
    const { close } = open()
    const outside = screen.getByRole('button', { name: 'Outside' })
    // jsdom does not reflect inert to its attribute. Use the DOM attribute too.
    outside.inert = true
    outside.setAttribute('inert', '')
    fireEvent.click(close)
    expect(outside.inert).toBe(true)
  })

  it('makes new background branches inert while open', async () => {
    const { close } = open()
    const added = document.createElement('button')
    document.body.appendChild(added)
    await waitFor(() => expect(added.inert).toBe(true))
    fireEvent.click(close)
    expect(added.inert).toBe(false)
    added.remove()
  })

  it('does not bubble backdrop pointer or click events to its parent', () => {
    const click = vi.fn()
    const pointer = vi.fn()
    const mouse = vi.fn()
    render(<div onClick={click} onPointerDown={pointer} onMouseDown={mouse}><MorphDialog /></div>)
    fireEvent.click(screen.getByRole('button', { name: /Edge Functions/ }))
    click.mockClear()
    const backdrop = screen.getByRole('dialog').previousElementSibling
    fireEvent.pointerDown(backdrop)
    fireEvent.mouseDown(backdrop)
    fireEvent.click(backdrop)
    expect(pointer).not.toHaveBeenCalled()
    expect(mouse).not.toHaveBeenCalled()
    expect(click).not.toHaveBeenCalled()
  })
})
