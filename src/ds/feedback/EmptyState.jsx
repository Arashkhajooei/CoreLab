import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function EmptyState({ icon = 'inbox', title, description, action, compact = false, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-2)', padding: compact ? 'var(--space-6)' : 'var(--space-12)', border: '1px dashed var(--color-divider)', borderRadius: 'var(--radius-md)', ...style }}>
      <Icon name={icon} size={24} strokeWidth={1.5} color="var(--color-text-3)" />
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-lg)', marginTop: 'var(--space-1)' }}>{title}</div>
      {description ? <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-2)', maxWidth: 420, lineHeight: 'var(--leading-normal)' }}>{description}</p> : null}
      {action ? <div style={{ marginTop: 'var(--space-2)' }}>{action}</div> : null}
    </div>
  );
}
