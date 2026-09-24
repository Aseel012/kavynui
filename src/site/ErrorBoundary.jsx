import { Component } from 'react'

// Catches render errors so one broken piece never blanks the page.
export default class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.warn('[kavyn] caught:', error, info?.componentStack)
  }
  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }
  reset = () => this.setState({ error: null })
  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback) return this.props.fallback(this.reset)
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false
    if (this.props.compact) {
      return (
        <div className="absolute inset-0 grid place-items-center p-4 text-center">
          <div>
            <div className="text-xs text-mute">{offline ? 'You are offline' : 'Preview failed to load'}</div>
            <button onClick={this.reset} className="mt-2 rounded-md border border-line2 px-2.5 py-1 text-xs text-tx hover:bg-panel2">Retry</button>
          </div>
        </div>
      )
    }
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-6 text-center">
        <div>
          <div className="mx-auto mb-5 size-10 rounded-xl border border-line2 bg-panel" />
          <h1 className="text-xl font-semibold tracking-tight text-tx">{offline ? 'You are offline' : 'Something went wrong'}</h1>
          <p className="mt-2 text-sm text-mute">{offline ? 'Reconnect and try again.' : 'This page hit an error. Try again, or reload if it keeps happening.'}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={this.reset} className="h-9 rounded-lg bg-tx px-4 text-sm font-medium text-bg">Try again</button>
            <button onClick={() => window.location.reload()} className="h-9 rounded-lg border border-line2 px-4 text-sm text-mute hover:text-tx">Reload</button>
          </div>
        </div>
      </div>
    )
  }
}
