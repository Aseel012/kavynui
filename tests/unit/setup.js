import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

// jsdom lacks these browser APIs; components only need them to exist.
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} }
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} }
window.matchMedia ??= () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })
URL.createObjectURL ??= () => 'blob:test'
URL.revokeObjectURL ??= () => {}
