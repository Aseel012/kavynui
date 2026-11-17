'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const openDialogs = []
const backgroundInert = new Map()
let backgroundChanges

function updateModality() {
  backgroundChanges?.disconnect()
  for (const [element, state] of backgroundInert) {
    if (state.observer.takeRecords().length) state.inert = element.inert
    state.observer.disconnect()
    element.inert = state.inert
  }
  backgroundInert.clear()
  const active = openDialogs.at(-1)
  for (const dialog of openDialogs) {
    if (dialog === active) dialog.setAttribute('aria-modal', 'true')
    else dialog.removeAttribute('aria-modal')
  }
  if (!active) return
  backgroundChanges ??= new MutationObserver(updateModality)
  let branch = active
  while (branch.parentElement) {
    backgroundChanges.observe(branch.parentElement, { childList: true })
    for (const sibling of branch.parentElement.children) {
      if (sibling !== branch && sibling !== active.previousElementSibling) {
        const state = { inert: sibling.inert === true, observer: null }
        state.observer = new MutationObserver(() => {
          // Keep an application's own inert changes when our modal closes.
          state.inert = sibling.inert
          state.observer.disconnect()
          sibling.inert = true
          state.observer.observe(sibling, { attributes: true, attributeFilter: ['inert'] })
        })
        sibling.inert = true
        state.observer.observe(sibling, { attributes: true, attributeFilter: ['inert'] })
        backgroundInert.set(sibling, state)
      }
    }
    branch = branch.parentElement
    if (branch === document.body) break
  }
}

// A card morphs into a dialog with a shared layout. Esc or the backdrop closes it.
export default function MorphDialog({ title = 'Edge Functions', meta = 'v2.4 · 12 regions', body = 'Run code within 50 ms of every user. Deploys roll out in seconds and roll back just as fast.' }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const trigger = triggerRef.current
    const close = dialog?.querySelector('button')
    if (!dialog || !close) return
    openDialogs.push(dialog)
    const isActive = () => openDialogs.at(-1) === dialog
    dialog.removeAttribute('inert')
    dialog.removeAttribute('aria-hidden')
    updateModality()
    close.focus()
    const keepFocusInside = (e) => {
      if (isActive() && !dialog.contains(e.target)) close?.focus()
    }
    const k = (e) => {
      if (!isActive()) return
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setOpen(false)
      } else if (e.key === 'Tab') {
        // The close button is the dialog's only interactive control.
        e.preventDefault()
        close?.focus()
      }
    }
    document.addEventListener('focusin', keepFocusInside)
    window.addEventListener('keydown', k)
    return () => {
      document.removeEventListener('focusin', keepFocusInside)
      window.removeEventListener('keydown', k)
      const wasActive = isActive()
      openDialogs.splice(openDialogs.indexOf(dialog), 1)
      // Motion keeps exit content mounted after the dialog has closed.
      dialog.setAttribute('inert', '')
      dialog.setAttribute('aria-hidden', 'true')
      dialog.removeAttribute('aria-modal')
      updateModality()
      if (wasActive) {
        const previous = openDialogs.at(-1)?.querySelector('button')
        if (previous) previous.focus()
        else if (trigger?.isConnected) trigger.focus()
      }
    }
  }, [open])
  return (
    <div className="relative grid h-[300px] w-[360px] max-w-full place-items-center">
      <motion.button ref={triggerRef} tabIndex={open ? -1 : 0} aria-hidden={open || undefined} layoutId={`card-${id}`} type="button" onClick={() => setOpen(true)} style={{ borderRadius: 16 }}
        className="w-60 border border-line2 bg-panel p-4 text-left">
        <motion.div layoutId={`art-${id}`} className="h-20 rounded-lg bg-[linear-gradient(135deg,#c8a27a,#3d2b1c)]" />
        <motion.div layoutId={`t-${id}`} className="mt-3 text-sm font-medium text-tx">{title}</motion.div>
        <motion.div layoutId={`m-${id}`} className="text-xs text-mute">{meta}</motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="absolute inset-0 z-10 rounded-2xl bg-bg/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setOpen(false) }} />
            <motion.div ref={dialogRef} layoutId={`card-${id}`} role="dialog" aria-modal="true" aria-label={title} style={{ borderRadius: 20 }}
              className="absolute inset-3 z-20 overflow-hidden border border-line2 bg-panel p-5">
              <motion.div layoutId={`art-${id}`} className="h-24 rounded-xl bg-[linear-gradient(135deg,#c8a27a,#3d2b1c)]" />
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <motion.div layoutId={`t-${id}`} className="text-base font-medium text-tx">{title}</motion.div>
                  <motion.div layoutId={`m-${id}`} className="text-xs text-mute">{meta}</motion.div>
                </div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-7 place-items-center rounded-full border border-line2 text-mute hover:text-tx">×</button>
              </div>
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} exit={{ opacity: 0 }} className="mt-3 text-sm leading-6 text-mute">{body}</motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
