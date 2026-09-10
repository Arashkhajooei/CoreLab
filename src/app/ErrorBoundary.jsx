import React from 'react'

// A bad value in one screen used to unmount the whole app and leave a black page.
// Keep the failure inside the screen and say what broke.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 460 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>
            This screen hit an error
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-2)', marginTop: 6 }}>
            The rest of the app still works — pick another section in the sidebar.
          </div>
          <pre style={{ marginTop: 12, padding: 12, background: 'var(--color-surface-2)', color: 'var(--color-danger-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {String(this.state.error && this.state.error.message)}
          </pre>
        </div>
      </div>
    )
  }
}
