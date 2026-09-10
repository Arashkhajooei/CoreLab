import React from 'react';

export function Field({ label, hint, error, required = false, htmlFor, inline = false, width, children, style }) {
  return (
    <div style={{ display: inline ? 'grid' : 'flex', gridTemplateColumns: inline ? '160px minmax(0, 1fr)' : undefined, flexDirection: 'column', gap: inline ? 'var(--space-3)' : 6, alignItems: inline ? 'start' : 'stretch', width, minWidth: 0, ...style }}>
      {label ? (
        <label htmlFor={htmlFor} style={{ display: 'flex', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-2)', lineHeight: inline ? 'var(--control-h-md)' : 1.3 }}>
          {label}{required ? <span style={{ color: 'var(--color-danger-text)' }}>*</span> : null}
        </label>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        {children}
        {error ? <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger-text)' }}>{error}</div> : hint ? <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-3)' }}>{hint}</div> : null}
      </div>
    </div>
  );
}
