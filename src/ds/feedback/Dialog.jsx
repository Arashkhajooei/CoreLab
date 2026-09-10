import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

export function Dialog({ open = true, title, description, children, actions, onClose, width = 480, tone = 'neutral', inline = false, style }) {
  if (!open) return null;
  const panel = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
      onClick={(e) => e.stopPropagation()}
      style={{ width: 'min(' + width + 'px, 100%)', display: 'flex', flexDirection: 'column', background: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)', borderTop: '2px solid ' + (tone === 'danger' ? 'var(--color-danger)' : 'var(--color-accent)'), borderRadius: 'var(--radius-lg)', ...style }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: '18px 20px 0' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)' }}>{title}</h2>
          {description ? <p style={{ marginTop: 6, fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)', color: 'var(--color-text-2)' }}>{description}</p> : null}
        </div>
        {onClose ? <IconButton icon="x" label="Close" size="sm" onClick={onClose} style={{ margin: '-6px -8px 0 0' }} /> : null}
      </div>
      {children ? <div style={{ padding: '16px 20px', fontSize: 'var(--text-sm)' }}>{children}</div> : <div style={{ height: 'var(--space-4)' }} />}
      {actions ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', padding: '12px 20px 16px', borderTop: '1px solid var(--color-hairline)' }}>{actions}</div> : null}
    </div>
  );
  if (inline) return panel;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-dialog)', display: 'grid', placeItems: 'center', padding: 'var(--space-4)', background: 'var(--color-overlay)' }}>
      {panel}
    </div>
  );
}
